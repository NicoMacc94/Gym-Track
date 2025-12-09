/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const DATA_FILE = path.join(__dirname, "..", "..", "data", "PALE-4-scheda-fase-3-p-min-esp.json");
const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || "dev-user";

const normalizeWeight = (value) => {
  if (!value) return "";
  const matches = `${value}`.match(/[\d.]+/g);
  if (!matches || matches.length === 0) return "";
  return matches.join("/");
};

const parseDate = (isoLike) => {
  if (!isoLike) return null;
  const parsed = new Date(isoLike);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const seed = async () => {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw);

  const planName = data.planName || "Scheda";
  const weeks = Array.isArray(data.weeks) ? data.weeks : [];
  const weeksCount = weeks.length || 1;

  // cleanup previous plan with same name for this user to avoid duplicati durante i test
  await prisma.plan.deleteMany({ where: { name: planName, userId: DEFAULT_USER_ID } });

  const daysCreate = [];
  const dayMeta = [];

  weeks.forEach((week) => {
    const weekNumber = week.weekNumber || 1;
    (week.days || []).forEach((day, idx) => {
      const scheduledDate = parseDate(day.date);
      const exercises = (day.exercises || []).map((ex) => ({
        name: ex.name || "Esercizio",
        targetSets: ex.sets != null ? String(ex.sets) : "",
        targetReps: ex.reps != null ? String(ex.reps) : "",
        note: ex.note || "",
        weekEntries: {
          create: [
            {
              weekNumber,
              actualReps: ex.reps != null ? String(ex.reps) : "",
              actualWeight: normalizeWeight(ex.weight),
            },
          ],
        },
      }));

      daysCreate.push({
        label: day.label || `Giorno ${idx + 1}`,
        orderIndex: daysCreate.length,
        scheduledDate,
        exercises: { create: exercises },
      });
      dayMeta.push({
        key: `${day.label || `Giorno ${idx + 1}`}|${scheduledDate ? scheduledDate.toISOString() : ""}`,
        weekNumber,
        sourceDay: day,
      });
    });
  });

  const plan = await prisma.plan.create({
    data: {
      name: planName,
      weeksCount,
      user: {
        connectOrCreate: {
          where: { id: DEFAULT_USER_ID },
          create: { id: DEFAULT_USER_ID },
        },
      },
      days: { create: daysCreate },
    },
    include: {
      days: {
        include: {
          exercises: true,
        },
      },
    },
  });

  // workout logs per esercizio: una entry per ogni serie indicata, se disponibile
  for (const day of plan.days) {
    const key = `${day.label}|${day.scheduledDate ? day.scheduledDate.toISOString() : ""}`;
    const meta = dayMeta.find((d) => d.key === key);
    const weekNumber = meta?.weekNumber || 1;
    const sourceDay = meta?.sourceDay;

    for (const exercise of day.exercises) {
      const sourceExercise = sourceDay?.exercises?.find((ex) => ex.name === exercise.name);
      const sets = sourceExercise?.sets && Number(sourceExercise.sets) > 0 ? Number(sourceExercise.sets) : 0;
      const reps = sourceExercise?.reps != null ? String(sourceExercise.reps) : "";
      const weight = normalizeWeight(sourceExercise?.weight);
      const logCount = sets || 1;

      for (let i = 1; i <= logCount; i++) {
        await prisma.workoutLog.create({
          data: {
            userId: DEFAULT_USER_ID,
            planId: plan.id,
            planDayId: day.id,
            planExerciseId: exercise.id,
            weekNumber,
            dayNumber: day.orderIndex + 1,
            date: day.scheduledDate || new Date(),
            setNumber: i,
            reps,
            weight,
            note: sourceExercise?.note || "",
          },
        });
      }
    }
  }

  console.log(`Seed completato: plan "${plan.name}" con ${plan.days.length} giorni.`);
};

seed()
  .catch((error) => {
    console.error("Errore seed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
