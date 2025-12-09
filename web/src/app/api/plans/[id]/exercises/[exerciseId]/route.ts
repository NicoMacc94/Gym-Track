import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/current-user";

const payloadSchema = z.object({
  name: z.string().min(1),
  targetSets: z.string().optional(),
  targetReps: z.string().optional(),
  note: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; exerciseId: string } },
) {
  const userId = getUserId(request);
  const planId = params.id;
  const exerciseId = params.exerciseId;

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
      select: { id: true },
    });

    if (!exercise) {
      return NextResponse.json({ error: "Esercizio non trovato" }, { status: 404 });
    }

    const updated = await prisma.planExercise.update({
      where: { id: exerciseId },
      data: {
        name: parsed.data.name,
        targetSets: parsed.data.targetSets ?? "",
        targetReps: parsed.data.targetReps ?? "",
        note: parsed.data.note ?? "",
      },
    });

    return NextResponse.json({
      exercise: {
        id: updated.id,
        name: updated.name,
        targetSets: updated.targetSets,
        targetReps: updated.targetReps,
        note: updated.note ?? "",
      },
    });
  } catch (error) {
    console.error("PATCH /plans/:id/exercises/:exerciseId error", error);
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento dell'esercizio" },
      { status: 500 },
    );
  }
}
