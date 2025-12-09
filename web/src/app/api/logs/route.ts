import { Prisma, WorkoutLog } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/current-user";

const logInputSchema = z.object({
  planId: z.string().min(1),
  planDayId: z.string().min(1),
  planExerciseId: z.string().min(1),
  weekNumber: z.number().int().min(1),
  dayNumber: z.number().int().min(1),
  date: z.string().min(1),
  setNumber: z.number().int().min(1),
  reps: z.string().min(1),
  weight: z.string().optional(),
  rpe: z.string().optional(),
  note: z.string().optional(),
});

const serializeLog = (log: WorkoutLog) => ({
  id: log.id,
  planId: log.planId,
  planDayId: log.planDayId,
  planExerciseId: log.planExerciseId,
  weekNumber: log.weekNumber,
  dayNumber: log.dayNumber,
  date: log.date.toISOString().slice(0, 10),
  setNumber: log.setNumber,
  reps: log.reps,
  weight: log.weight ?? "",
  rpe: log.rpe ?? "",
  note: log.note ?? "",
  createdAt: log.createdAt,
});

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  const { searchParams } = new URL(request.url);
  const planId = searchParams.get("planId") || undefined;
  const week = searchParams.get("week") ? Number(searchParams.get("week")) : undefined;
  const day = searchParams.get("day") ? Number(searchParams.get("day")) : undefined;

  const where: Prisma.WorkoutLogWhereInput = { userId };
  if (planId) where.planId = planId;
  if (week && Number.isInteger(week)) where.weekNumber = week;
  if (day && Number.isInteger(day)) where.dayNumber = day;

  try {
    const logs = await prisma.workoutLog.findMany({
      where,
      orderBy: [{ date: "desc" }, { setNumber: "asc" }],
    });
    return NextResponse.json({ logs: logs.map(serializeLog) });
  } catch (error) {
    console.error("GET /logs error", error);
    return NextResponse.json({ error: "Errore nel recupero dei log" }, { status: 500 });
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

  const parsed = logInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload non valido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const plan = await prisma.plan.findFirst({
      where: { id: data.planId, userId, deletedAt: null },
      select: { id: true },
    });
    if (!plan) {
      return NextResponse.json({ error: "Scheda non trovata per l'utente" }, { status: 404 });
    }

    const exerciseExists = await prisma.planExercise.findFirst({
      where: {
        id: data.planExerciseId,
        deletedAt: null,
        day: { id: data.planDayId, planId: data.planId, deletedAt: null },
      },
      select: { id: true },
    });
    if (!exerciseExists) {
      return NextResponse.json({ error: "Esercizio non valido" }, { status: 400 });
    }

    const log = await prisma.workoutLog.create({
      data: {
        userId,
        planId: data.planId,
        planDayId: data.planDayId,
        planExerciseId: data.planExerciseId,
        weekNumber: data.weekNumber,
        dayNumber: data.dayNumber,
        date: new Date(data.date),
        setNumber: data.setNumber,
        reps: data.reps,
        weight: data.weight,
        rpe: data.rpe,
        note: data.note,
      },
    });

    return NextResponse.json({ log: serializeLog(log) }, { status: 201 });
  } catch (error) {
    console.error("POST /logs error", error);
    return NextResponse.json({ error: "Errore durante il salvataggio del log" }, { status: 500 });
  }
}
