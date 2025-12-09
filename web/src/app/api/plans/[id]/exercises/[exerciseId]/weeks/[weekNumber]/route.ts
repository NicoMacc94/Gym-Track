import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/current-user";

const payloadSchema = z.object({
  reps: z.string().optional(),
  weight: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; exerciseId: string; weekNumber: string } },
) {
  const userId = getUserId(request);
  const planId = params.id;
  const exerciseId = params.exerciseId;
  const weekNumber = Number(params.weekNumber);

  if (!Number.isInteger(weekNumber) || weekNumber < 1) {
    return NextResponse.json(
      { error: "Numero settimana non valido" },
      { status: 400 },
    );
  }

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
    const exercise = await prisma.planExercise.findFirst({
      where: {
        id: exerciseId,
        deletedAt: null,
        day: {
          plan: { id: planId, userId, deletedAt: null },
          deletedAt: null,
        },
      },
      select: {
        id: true,
        day: { select: { plan: { select: { weeksCount: true } } } },
      },
    });

    if (!exercise) {
      return NextResponse.json({ error: "Esercizio non trovato" }, { status: 404 });
    }

    const maxWeek = exercise.day.plan.weeksCount;
    if (weekNumber > maxWeek) {
      return NextResponse.json(
        { error: `Settimana fuori range, massimo consentito ${maxWeek}` },
        { status: 400 },
      );
    }

    const entry = await prisma.planWeekEntry.upsert({
      where: {
        planExerciseId_weekNumber: { planExerciseId: exerciseId, weekNumber },
      },
      update: {
        actualReps: parsed.data.reps ?? "",
        actualWeight: parsed.data.weight ?? "",
      },
      create: {
        planExerciseId: exerciseId,
        weekNumber,
        actualReps: parsed.data.reps ?? "",
        actualWeight: parsed.data.weight ?? "",
      },
    });

    return NextResponse.json({
      entry: {
        weekNumber: entry.weekNumber,
        reps: entry.actualReps ?? "",
        weight: entry.actualWeight ?? "",
      },
    });
  } catch (error) {
    console.error("PUT /plans/:id/exercises/:exerciseId/weeks/:weekNumber error", error);
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento della settimana" },
      { status: 500 },
    );
  }
}
