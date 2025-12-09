import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/current-user";

const payloadSchema = z.object({
  action: z.enum(["add", "remove"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = getUserId(request);
  const planId = params.id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload non valido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const plan = await prisma.plan.findFirst({
      where: { id: planId, userId, deletedAt: null },
      include: {
        days: {
          where: { deletedAt: null },
          include: {
            exercises: { where: { deletedAt: null }, select: { id: true } },
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Scheda non trovata" }, { status: 404 });
    }

    const exerciseIds = plan.days.flatMap((day) => day.exercises.map((ex) => ex.id));

    if (parsed.data.action === "add") {
      const nextWeek = plan.weeksCount + 1;
      await prisma.$transaction([
        prisma.plan.update({ where: { id: planId }, data: { weeksCount: nextWeek } }),
        ...(exerciseIds.length > 0
          ? [
              prisma.planWeekEntry.createMany({
                data: exerciseIds.map((exerciseId) => ({
                  planExerciseId: exerciseId,
                  weekNumber: nextWeek,
                  actualReps: "",
                  actualWeight: "",
                })),
              }),
            ]
          : []),
      ]);

      return NextResponse.json({ weeksCount: nextWeek });
    }

    if (plan.weeksCount <= 1) {
      return NextResponse.json(
        { error: "Non puoi rimuovere l'ultima settimana" },
        { status: 400 },
      );
    }

    const targetWeek = plan.weeksCount;
    await prisma.$transaction([
      prisma.planWeekEntry.deleteMany({
        where: {
          weekNumber: targetWeek,
          exercise: { day: { planId } },
        },
      }),
      prisma.planWeekTarget.deleteMany({
        where: {
          weekNumber: targetWeek,
          exercise: { day: { planId } },
        },
      }),
      prisma.plan.update({ where: { id: planId }, data: { weeksCount: targetWeek - 1 } }),
    ]);

    return NextResponse.json({ weeksCount: targetWeek - 1 });
  } catch (error) {
    console.error("PATCH /plans/:id/weeks error", error);
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento delle settimane" },
      { status: 500 },
    );
  }
}
