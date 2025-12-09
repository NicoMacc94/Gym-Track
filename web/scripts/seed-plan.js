/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PALE_TXT = path.join(__dirname, "..", "..", "data", "Pale4.txt");
const SKELETON_JSON = path.join(__dirname, "..", "..", "data", "schedaFase3.json");
const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || "dev-user";
const YEAR = 2025;

const normalizeName = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const normalizeWeight = (value) => {
  if (!value) return "/";
  const matches = `${value}`.match(/[\d.,]+/g);
  if (!matches || matches.length === 0) return "/";
  return matches
    .map((m) => {
      const num = Number.parseFloat(m.replace(",", "."));
      return Number.isFinite(num) ? String(num) : null;
    })
    .filter(Boolean)
    .join("/");
};

const parseDate = (value) => {
  if (!value) return null;
  const [dayStr, monthStr] = value.split("/");
  const day = Number(dayStr);
  const month = Number(monthStr);
  if (!day || !month) return null;
  const iso = `${YEAR}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseExerciseLine = (line) => {
  const cleaned = line.replace(/^\*\s*/, "").trim();
  if (!cleaned) return null;

  const noteMatches = cleaned.match(/\(([^)]+)\)/);
  const note = noteMatches ? noteMatches[1] : "";
  const withoutParens = cleaned.replace(/\(([^)]+)\)/g, "").trim();

  const weightMatch = withoutParens.match(/peso[s]?:\s*([^,]+)/i);
  const weightRaw = weightMatch ? weightMatch[1].trim() : "";
  const weight = normalizeWeight(weightRaw);

  const withoutWeight = weightMatch
    ? withoutParens.replace(weightMatch[0], "").trim()
    : withoutParens;

  const colonSplit = withoutWeight.split(":");
  const namePart = colonSplit[0].trim();
  const rest = colonSplit.slice(1).join(":").trim();

  let sets = "/";
  let reps = "/";

  if (rest) {
    const sr = rest.match(/(\d+(?:[\.,]?\d+)*)\s*x\s*([^\s,]+)/i);
    if (sr) {
      sets = sr[1].replace(",", ".");
      reps = sr[2];
    } else if (rest.match(/^\d+$/)) {
      sets = rest;
      reps = "/";
    }
  }

  return {
    name: namePart || "Esercizio",
    sets: sets || "/",
    reps: reps || "/",
    weight: weight || "/",
    note,
  };
};

const parsePaleTxt = () => {
  const content = fs.readFileSync(PALE_TXT, "utf-8").split("\n");
  const weeks = [];
  let currentWeek = 0;
  let currentDay = null;

  const pushDay = () => {
    if (currentDay) {
      weeks.push(currentDay);
      currentDay = null;
    }
  };

  content.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    const weekMatch = line.match(/SETTIMANA\s+(\d+)/i);
    if (weekMatch) {
      currentWeek = Number(weekMatch[1]);
      return;
    }

    const dayMatch = line.match(/^(\d+)\s+([A-Za-zÀ-ÿ]+)\s+(\d{1,2}\/\d{1,2})/);
    if (dayMatch) {
      pushDay();
      currentDay = {
        weekNumber: currentWeek || 1,
        dayNumber: Number(dayMatch[1]),
        label: dayMatch[2],
        date: parseDate(dayMatch[3]),
        exercises: [],
      };
      return;
    }

    if (line.startsWith("*")) {
      const ex = parseExerciseLine(line);
      if (ex && currentDay) {
        currentDay.exercises.push(ex);
      }
    }
  });
  pushDay();

  return weeks;
};

const loadSkeleton = () => {
  const raw = fs.readFileSync(SKELETON_JSON, "utf-8");
  const data = JSON.parse(raw);
  const days = data.giorni || [];
  return days.map((day, idx) => ({
    dayNumber: day.giorno || idx + 1,
    label: `Giorno ${day.giorno || idx + 1}`,
    exercises: (day.esercizi || []).map((ex) => ({
      name: ex.nome,
      targetSets: ex.serie != null ? String(ex.serie) : "/",
      targetReps: ex.ripetizioni || "/",
      note: ex.obiettivo || "",
    })),
  }));
};

const buildPlanData = () => {
  const parsed = parsePaleTxt();
  const skeleton = loadSkeleton();
  const weeksCount = Math.max(...parsed.map((d) => d.weekNumber));

  const baseDays = skeleton.map((day) => ({
    dayNumber: day.dayNumber,
    label: day.label,
    scheduledDate: parsed.find((d) => d.weekNumber === 1 && d.dayNumber === day.dayNumber)?.date || null,
    exercises: day.exercises.map((ex) => ({
      name: ex.name,
      targetSets: ex.targetSets,
      targetReps: ex.targetReps,
      note: ex.note,
      weeks: Array.from({ length: weeksCount }, (_, i) => ({
        weekNumber: i + 1,
        reps: "/",
        weight: "/",
      })),
    })),
  }));

  parsed.forEach((day) => {
    const baseDay = baseDays.find((d) => d.dayNumber === day.dayNumber);
    if (!baseDay) return;

    day.exercises.forEach((ex) => {
      const norm = normalizeName(ex.name);
      let targetExercise = baseDay.exercises.find(
        (e) => normalizeName(e.name) === norm,
      );

      if (!targetExercise) {
        targetExercise = {
          name: ex.name,
          targetSets: ex.sets || "/",
          targetReps: ex.reps || "/",
          note: ex.note || "",
          weeks: Array.from({ length: weeksCount }, (_, i) => ({
            weekNumber: i + 1,
            reps: "/",
            weight: "/",
          })),
        };
        baseDay.exercises.push(targetExercise);
      }

      const reps = ex.reps || "/";
      const weight = ex.weight || "/";
      targetExercise.weeks[day.weekNumber - 1] = {
        weekNumber: day.weekNumber,
        reps,
        weight,
      };
    });
  });

  return {
    name: "PALE 4 (scheda fase 3 P min esp)",
    weeksCount,
    days: baseDays,
  };
};

const seed = async () => {
  const planData = buildPlanData();

  await prisma.workoutLog.deleteMany({ where: { userId: DEFAULT_USER_ID } });
  await prisma.plan.deleteMany({ where: { name: planData.name, userId: DEFAULT_USER_ID } });

  const plan = await prisma.plan.create({
    data: {
      name: planData.name,
      weeksCount: planData.weeksCount,
      user: {
        connectOrCreate: {
          where: { id: DEFAULT_USER_ID },
          create: { id: DEFAULT_USER_ID },
        },
      },
      days: {
        create: planData.days.map((day, idx) => ({
          label: day.label,
          orderIndex: idx,
          scheduledDate: day.scheduledDate,
          exercises: {
            create: day.exercises.map((ex) => ({
              name: ex.name,
              targetSets: ex.targetSets,
              targetReps: ex.targetReps,
              note: ex.note,
              weekEntries: {
                create: ex.weeks.map((w) => ({
                  weekNumber: w.weekNumber,
                  actualReps: w.reps || "/",
                  actualWeight: w.weight || "/",
                })),
              },
            })),
          },
        })),
      },
    },
  });

  // Crea log per storico: un log per ogni esercizio/set dichiarato
  for (const day of planData.days) {
    const prismaDay = await prisma.planDay.findFirst({
      where: { planId: plan.id, orderIndex: day.dayNumber - 1 },
      include: { exercises: true },
    });
    if (!prismaDay) continue;

    for (const ex of day.exercises) {
      const prismaEx = prismaDay.exercises.find((e) => normalizeName(e.name) === normalizeName(ex.name));
      if (!prismaEx) continue;
      const setsNumber = Number.parseInt(ex.targetSets, 10);
      const logSets = Number.isFinite(setsNumber) && setsNumber > 0 ? setsNumber : 1;

      ex.weeks.forEach((weekEntry) => {
        for (let s = 1; s <= logSets; s++) {
          prisma.workoutLog.create({
            data: {
              userId: DEFAULT_USER_ID,
              planId: plan.id,
              planDayId: prismaDay.id,
              planExerciseId: prismaEx.id,
              weekNumber: weekEntry.weekNumber,
              dayNumber: day.dayNumber,
              date: day.scheduledDate || new Date(),
              setNumber: s,
              reps: weekEntry.reps || "/",
              weight: weekEntry.weight || "/",
              note: ex.note || "",
            },
          }).catch((error) => {
            console.error("Errore creando workoutLog", error);
          });
        }
      });
    }
  }

  console.log(`Seed completato: plan "${plan.name}" con ${planData.days.length} giorni base e ${planData.weeksCount} settimane.`);
};

seed()
  .catch((error) => {
    console.error("Errore seed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
