import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/current-user";

const payloadSchema = z.object({
  label: z.string().min(1),
  orderIndex: z.number().int().min(0).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; dayId: string } },
) {
  const userId = getUserId(request);
  const planId = params.id;
  const dayId = params.dayId;

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
    const day = await prisma.planDay.findFirst({
      where: { id: dayId, planId, deletedAt: null, plan: { userId } },
    });

    if (!day) {
      return NextResponse.json({ error: "Giorno non trovato" }, { status: 404 });
    }

    const updated = await prisma.planDay.update({
      where: { id: dayId },
      data: {
        label: parsed.data.label,
        orderIndex: parsed.data.orderIndex ?? day.orderIndex,
      },
    });

    return NextResponse.json({
      day: { id: updated.id, label: updated.label, orderIndex: updated.orderIndex },
    });
  } catch (error) {
    console.error("PATCH /plans/:id/days/:dayId error", error);
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento del giorno" },
      { status: 500 },
    );
  }
}
