import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/current-user";

const payloadSchema = z.object({
  label: z.string().optional(),
  scheduledDate: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = getUserId(request);
  const planId = params.id;

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
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
          select: { orderIndex: true },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Scheda non trovata" }, { status: 404 });
    }

    const nextOrder =
      plan.days.reduce((max, day) => Math.max(max, day.orderIndex), -1) + 1;
    const label =
      parsed.data.label && parsed.data.label.trim().length > 0
        ? parsed.data.label.trim()
        : `Giorno ${nextOrder + 1}`;

    const created = await prisma.planDay.create({
      data: {
        planId,
        orderIndex: nextOrder,
        label,
        scheduledDate: parsed.data.scheduledDate
          ? new Date(parsed.data.scheduledDate)
          : null,
      },
    });

    return NextResponse.json(
      {
        day: {
          id: created.id,
          label: created.label,
          orderIndex: created.orderIndex,
          scheduledDate: created.scheduledDate,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /plans/:id/days error", error);
    return NextResponse.json(
      { error: "Errore durante la creazione del giorno" },
      { status: 500 },
    );
  }
}
