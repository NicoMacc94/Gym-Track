import { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/current-user";

const exerciseInputSchema = z.object({
  name: z.string().min(1),
  targetSets: z.string().min(1),
  targetReps: z.string().min(1),
});

const dayInputSchema = z.object({
  label: z.string().optional(),
  orderIndex: z.number().int().min(0).optional(),
  exercises: z.array(exerciseInputSchema).min(1),
  scheduledDate: z.string().optional(),
});

const planInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  weeksCount: z.number().int().min(1).max(52),
  days: z.array(dayInputSchema).min(1),
});

type PlanWithRelations = Prisma.PlanGetPayload<{
  include: {
    days: {
      include: {
        exercises: {
          include: { weekEntries: true };
        };
      };
    };
  };
}>;

export const serializePlan = (plan: PlanWithRelations) => ({
  id: plan.id,
  name: plan.name,
  description: plan.description ?? "",
  weeks: plan.weeksCount,
  days: plan.days
    .sort(
      (
        a: PlanWithRelations["days"][number],
        b: PlanWithRelations["days"][number],
      ) => a.orderIndex - b.orderIndex,
    )
    .map((day) => ({
      id: day.id,
      label: day.label,
      orderIndex: day.orderIndex,
      scheduledDate: day.scheduledDate,
      exercises: day.exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        weeks: ex.weekEntries
          .sort(
            (
              a: PlanWithRelations["days"][number]["exercises"][number]["weekEntries"][number],
              b: PlanWithRelations["days"][number]["exercises"][number]["weekEntries"][number],
            ) => a.weekNumber - b.weekNumber,
          )
          .map((entry) => ({
            weekNumber: entry.weekNumber,
            reps: entry.actualReps ?? "",
            weight: entry.actualWeight ?? "",
          })),
      })),
    })),
});

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  try {
    const plans = await prisma.plan.findMany({
      where: { userId, deletedAt: null },
      include: {
        days: {
          where: { deletedAt: null },
          include: {
            exercises: {
              where: { deletedAt: null },
              include: { weekEntries: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const payload = plans.map(serializePlan);
    return NextResponse.json({ plans: payload });
  } catch (error) {
    console.error("GET /plans error", error);
    return NextResponse.json(
      { error: "Errore nel recupero delle schede" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = planInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload non valido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        weeksCount: data.weeksCount,
        user: {
          connectOrCreate: {
            where: { id: userId },
            create: { id: userId },
          },
        },
        days: {
          create: data.days.map((day, index) => ({
            label: day.label && day.label.trim().length > 0 ? day.label : `Giorno ${index + 1}`,
            orderIndex: day.orderIndex ?? index,
            scheduledDate: day.scheduledDate ? new Date(day.scheduledDate) : null,
            exercises: {
              create: day.exercises.map((ex) => ({
                name: ex.name,
                targetSets: ex.targetSets,
                targetReps: ex.targetReps,
                weekEntries: {
                  create: Array.from({ length: data.weeksCount }, (_, i) => ({
                    weekNumber: i + 1,
                    actualReps: "",
                    actualWeight: "",
                  })),
                },
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: {
            exercises: { include: { weekEntries: true } },
          },
        },
      },
    });

    return NextResponse.json({ plan: serializePlan(plan) }, { status: 201 });
  } catch (error) {
    console.error("POST /plans error", error);
    return NextResponse.json(
      { error: "Errore durante la creazione della scheda" },
      { status: 500 },
    );
  }
}
