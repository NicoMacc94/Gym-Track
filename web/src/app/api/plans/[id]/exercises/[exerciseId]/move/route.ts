import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/current-user";

const payloadSchema = z.object({
  targetDayId: z.string().min(1),
});

export async function POST(
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

  const { targetDayId } = parsed.data;

  try {
    const exercise = await prisma.planExercise.findFirst({
      where: {
        id: exerciseId,
        deletedAt: null,
        day: { planId, plan: { userId, deletedAt: null }, deletedAt: null },
      },
      select: { id: true },
    });
    if (!exercise) {
      return NextResponse.json({ error: "Esercizio non trovato" }, { status: 404 });
    }

    const targetDay = await prisma.planDay.findFirst({
      where: { id: targetDayId, planId, deletedAt: null },
      select: { id: true },
    });
    if (!targetDay) {
      return NextResponse.json({ error: "Giorno target non valido" }, { status: 400 });
    }

    await prisma.planExercise.update({
      where: { id: exerciseId },
      data: {
        planDayId: targetDayId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /plans/:id/exercises/:exerciseId/move error", error);
    return NextResponse.json(
      { error: "Errore durante lo spostamento dell'esercizio" },
      { status: 500 },
    );
  }
}
