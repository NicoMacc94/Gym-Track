import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/current-user";
import { serializePlan } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = getUserId(request);
  const planId = params.id;
  try {
    const plan = await prisma.plan.findFirst({
      where: { id: planId, userId, deletedAt: null },
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
    });

    if (!plan) {
      return NextResponse.json({ error: "Scheda non trovata" }, { status: 404 });
    }

    return NextResponse.json({ plan: serializePlan(plan) });
  } catch (error) {
    console.error("GET /plans/:id error", error);
    return NextResponse.json(
      { error: "Errore nel recupero della scheda" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = getUserId(request);
  const planId = params.id;

  try {
    const plan = await prisma.plan.findFirst({
      where: { id: planId, userId, deletedAt: null },
      select: { id: true },
    });
    if (!plan) {
      return NextResponse.json({ error: "Scheda non trovata" }, { status: 404 });
    }

    await prisma.plan.delete({
      where: { id: planId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /plans/:id error", error);
    return NextResponse.json(
      { error: "Errore durante l'eliminazione della scheda" },
      { status: 500 },
    );
  }
}
