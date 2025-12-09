"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type WeekValues = {
  reps: string;
  weight: string;
};

type ExercisePlan = {
  id: string;
  name: string;
  targetSets: number;
  targetReps: string;
  weeks: WeekValues[];
};

type DayPlan = {
  id: string;
  label: string;
  exercises: ExercisePlan[];
};

type TrainingPlan = {
  id: string;
  name: string;
  description: string;
  weeks: number;
  days: DayPlan[];
};

const initialPlans: TrainingPlan[] = [
  {
    id: "plan-1",
    name: "Forza Base",
    description: "8 settimane di progressione lineare per fondamentali",
    weeks: 8,
    days: [
      {
        id: "plan-1-day-1",
        label: "Lower + Spinta",
        exercises: [
          {
            id: "squat",
            name: "Squat bilanciere",
            targetSets: 3,
            targetReps: "5",
            weeks: [
              { reps: "5", weight: "120" },
              { reps: "5", weight: "125" },
              { reps: "5", weight: "130" },
              { reps: "5", weight: "132.5" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "bench",
            name: "Panca piana",
            targetSets: 4,
            targetReps: "6",
            weeks: [
              { reps: "6", weight: "85" },
              { reps: "6", weight: "87.5" },
              { reps: "6", weight: "90" },
              { reps: "6", weight: "92.5" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "row",
            name: "Rematore bilanciere",
            targetSets: 3,
            targetReps: "8",
            weeks: [
              { reps: "8", weight: "60" },
              { reps: "8", weight: "62.5" },
              { reps: "8", weight: "65" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
            ],
          },
        ],
      },
      {
        id: "plan-1-day-2",
        label: "Upper",
        exercises: [
          {
            id: "ohp",
            name: "Military press",
            targetSets: 3,
            targetReps: "8",
            weeks: [
              { reps: "8", weight: "45" },
              { reps: "8", weight: "" },
              { reps: "8", weight: "47.5" },
              { reps: "8", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "dips",
            name: "Dip parallele",
            targetSets: 3,
            targetReps: "10",
            weeks: [
              { reps: "10", weight: "bodyweight" },
              { reps: "", weight: "" },
              { reps: "10", weight: "bodyweight +5" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "laterals",
            name: "Alzate laterali",
            targetSets: 3,
            targetReps: "15",
            weeks: [
              { reps: "15", weight: "8" },
              { reps: "", weight: "" },
              { reps: "15", weight: "9" },
              { reps: "15", weight: "10" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
            ],
          },
        ],
      },
      {
        id: "plan-1-day-3",
        label: "Lower + Catena posteriore",
        exercises: [
          {
            id: "rdl",
            name: "Stacco rumeno",
            targetSets: 4,
            targetReps: "8",
            weeks: [
              { reps: "8", weight: "100" },
              { reps: "8", weight: "105" },
              { reps: "8", weight: "110" },
              { reps: "8", weight: "112.5" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "lunges",
            name: "Affondi manubri",
            targetSets: 3,
            targetReps: "10",
            weeks: [
              { reps: "10", weight: "20" },
              { reps: "", weight: "" },
              { reps: "10", weight: "22.5" },
              { reps: "10", weight: "24" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "core",
            name: "Plank",
            targetSets: 3,
            targetReps: "45s",
            weeks: [
              { reps: "45s", weight: "" },
              { reps: "50s", weight: "" },
              { reps: "50s", weight: "" },
              { reps: "55s", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
              { reps: "", weight: "" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plan-2",
    name: "Ipertrofia Upper/Lower",
    description: "Ciclo 2 settimane, focus volume controllato",
    weeks: 2,
    days: [
      {
        id: "plan-2-day-1",
        label: "Upper A",
        exercises: [
          {
            id: "incline",
            name: "Panca inclinata",
            targetSets: 4,
            targetReps: "8-10",
            weeks: [
              { reps: "10", weight: "60" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "lat",
            name: "Lat machine",
            targetSets: 3,
            targetReps: "12",
            weeks: [
              { reps: "12", weight: "50" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "curl",
            name: "Curl bilanciere",
            targetSets: 3,
            targetReps: "10",
            weeks: [
              { reps: "10", weight: "30" },
              { reps: "", weight: "" },
            ],
          },
        ],
      },
      {
        id: "plan-2-day-2",
        label: "Lower A",
        exercises: [
          {
            id: "legpress",
            name: "Leg press",
            targetSets: 4,
            targetReps: "12",
            weeks: [
              { reps: "12", weight: "180" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "legcurl",
            name: "Leg curl",
            targetSets: 3,
            targetReps: "12-15",
            weeks: [
              { reps: "12", weight: "45" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "calf",
            name: "Calf raise",
            targetSets: 4,
            targetReps: "15",
            weeks: [
              { reps: "15", weight: "60" },
              { reps: "", weight: "" },
            ],
          },
        ],
      },
      {
        id: "plan-2-day-3",
        label: "Upper B",
        exercises: [
          {
            id: "row-machine",
            name: "Rematore macchina",
            targetSets: 3,
            targetReps: "10",
            weeks: [
              { reps: "10", weight: "55" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "pullup",
            name: "Trazioni",
            targetSets: 3,
            targetReps: "max",
            weeks: [
              { reps: "8", weight: "bodyweight" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "triceps",
            name: "Pushdown cavo",
            targetSets: 3,
            targetReps: "12",
            weeks: [
              { reps: "12", weight: "35" },
              { reps: "", weight: "" },
            ],
          },
        ],
      },
    ],
  },
];

const getTotalExercises = (plan: TrainingPlan) =>
  plan.days.reduce((count, day) => count + day.exercises.length, 0);

export default function AggiornamentoPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>(initialPlans);
  const [openPlanId, setOpenPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const normalizePlan = (plan: TrainingPlan): TrainingPlan => {
    return {
      ...plan,
      days: plan.days.map((day) => ({
        ...day,
        exercises: day.exercises.map((exercise) => {
          const filledWeeks =
            exercise.weeks.length >= plan.weeks
              ? exercise.weeks
              : [
                  ...exercise.weeks,
                  ...Array.from(
                    { length: plan.weeks - exercise.weeks.length },
                    (_, idx) => ({
                      weekNumber: exercise.weeks.length + idx + 1,
                      reps: "",
                      weight: "",
                    }),
                  ),
                ];
          return { ...exercise, weeks: filledWeeks };
        }),
      })),
    };
  };

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setStatusMessage(null);
      try {
        const response = await fetch("/api/plans", {
          headers: {
            "x-user-id": "dev-user",
          },
        });
        if (!response.ok) {
          throw new Error("Impossibile caricare le schede dal backend");
        }
        const payload = await response.json();
        const apiPlans = Array.isArray(payload.plans) ? payload.plans : [];
        if (apiPlans.length === 0) {
          setPlans(initialPlans);
          setOpenPlanId(initialPlans[0]?.id ?? null);
          setStatusMessage("Nessuna scheda trovata nel backend, uso il mock locale.");
          return;
        }
        const normalized = apiPlans.map(normalizePlan);
        setPlans(normalized);
        setOpenPlanId(normalized[0]?.id ?? null);
      } catch (error) {
        console.error("Errore caricamento schede", error);
        setPlans(initialPlans);
        setOpenPlanId(initialPlans[0]?.id ?? null);
        setStatusMessage("Backend non raggiungibile, uso il mock locale.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const togglePlan = (planId: string) => {
    setOpenPlanId((current) => (current === planId ? null : planId));
  };

  const persistWeekValue = async (
    planId: string,
    exerciseId: string,
    weekNumber: number,
    data: Partial<WeekValues>,
  ) => {
    try {
      const response = await fetch(
        `/api/plans/${planId}/exercises/${exerciseId}/weeks/${weekNumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "dev-user",
          },
          body: JSON.stringify({
            reps: data.reps ?? "",
            weight: data.weight ?? "",
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Errore salvataggio settimana");
      }
    } catch (error) {
      console.error("Persist week value error", error);
      setStatusMessage("Salvataggio non riuscito (week). Controlla la connessione al backend.");
    }
  };

  const updateWeekValue = (
    planId: string,
    dayId: string,
    exerciseId: string,
    weekIndex: number,
    field: keyof WeekValues,
    value: string,
  ) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          days: plan.days.map((day) => {
            if (day.id !== dayId) return day;
            return {
              ...day,
              exercises: day.exercises.map((exercise) => {
                if (exercise.id !== exerciseId) return exercise;
                return {
                  ...exercise,
                  weeks: exercise.weeks.map((week, index) => {
                    if (index !== weekIndex) return week;
                    return { ...week, [field]: value };
                  }),
                };
              }),
            };
          }),
        };
      }),
    );
    void persistWeekValue(planId, exerciseId, weekIndex + 1, { [field]: value });
  };

  const updateDayLabel = (planId: string, dayId: string, label: string) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          days: plan.days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  label,
                }
              : day,
          ),
        };
      }),
    );
    void (async () => {
      try {
        const response = await fetch(`/api/plans/${planId}/days/${dayId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "dev-user",
          },
          body: JSON.stringify({ label }),
        });
        if (!response.ok) {
          throw new Error("Errore salvataggio giorno");
        }
      } catch (error) {
        console.error("Persist day label error", error);
        setStatusMessage("Salvataggio non riuscito (giorno). Controlla la connessione al backend.");
      }
    })();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Aggiornamento schede</p>
        <h1 className={styles.title}>Completa le tue schede settimana per settimana</h1>
        <p className={styles.lead}>
          Apri una scheda per vedere i giorni, gli esercizi e gli slot di ogni settimana.
          Compila ripetizioni e peso dove mancano o aggiorna i valori esistenti per tenere
          traccia dei carichi.
        </p>
        {loading && <div className={styles.banner}>Caricamento schede...</div>}
        {!loading && statusMessage && <div className={styles.banner}>{statusMessage}</div>}
      </header>

      <div className={styles.cardList}>
        {plans.map((plan) => {
          const isOpen = openPlanId === plan.id;
          const weekNumbers = Array.from({ length: plan.weeks }, (_, index) => index + 1);

          return (
            <article
              key={plan.id}
              className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}
            >
              <button
                type="button"
                className={styles.cardHeader}
                onClick={() => togglePlan(plan.id)}
                aria-expanded={isOpen}
                aria-controls={`plan-${plan.id}`}
              >
                <div className={styles.cardHeading}>
                  <p className={styles.cardEyebrow}>{plan.description}</p>
                  <h2 className={styles.cardTitle}>{plan.name}</h2>
                  <div className={styles.badgeRow}>
                    <span className={styles.badge}>Settimane: {plan.weeks}</span>
                    <span className={styles.badge}>Giorni: {plan.days.length}</span>
                    <span className={styles.badge}>Esercizi: {getTotalExercises(plan)}</span>
                  </div>
                </div>
                <div className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />
              </button>

              {isOpen ? (
                <div className={styles.cardBody} id={`plan-${plan.id}`}>
                  {plan.days.map((day, dayIndex) => (
                    <section key={day.id} className={styles.daySection}>
                      <div className={styles.dayHeader}>
                        <div className={styles.dayHeading}>
                          <p className={styles.dayEyebrow}>Giorno {dayIndex + 1}</p>
                          <div className={styles.dayTitleRow}>
                            <h3 className={styles.dayTitle}>Nome giorno</h3>
                            <input
                              type="text"
                              value={day.label}
                              onChange={(event) =>
                                updateDayLabel(plan.id, day.id, event.target.value)
                              }
                              placeholder="Es. Upper/Lower"
                              className={styles.dayNameInput}
                            />
                          </div>
                        </div>
                        <span className={styles.dayBadge}>
                          {day.exercises.length} esercizi
                        </span>
                      </div>

                      <div className={styles.tableShell}>
                        <div
                          className={styles.tableGrid}
                          style={{
                            gridTemplateColumns: `minmax(200px, 1.1fr) repeat(${plan.weeks}, minmax(120px, 1fr))`,
                          }}
                        >
                          <div className={`${styles.cell} ${styles.headerCell}`}>
                            Esercizio
                          </div>
                          {weekNumbers.map((week) => (
                            <div
                              key={`${plan.id}-${day.id}-week-${week}`}
                              className={`${styles.cell} ${styles.headerCell}`}
                            >
                              <span className={styles.weekLabel}>Sett {week}</span>
                            </div>
                          ))}
                        </div>

                        {day.exercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className={styles.tableGrid}
                            style={{
                              gridTemplateColumns: `minmax(200px, 1.1fr) repeat(${plan.weeks}, minmax(120px, 1fr))`,
                            }}
                          >
                            <div className={`${styles.cell} ${styles.exerciseCell}`}>
                              <p className={styles.exerciseName}>{exercise.name}</p>
                              <p className={styles.exerciseMeta}>
                                {exercise.targetSets} serie x target {exercise.targetReps} reps
                              </p>
                            </div>

                            {exercise.weeks.map((weekValue, weekIndex) => (
                            <div
                              key={`${exercise.id}-week-${weekIndex}`}
                              className={`${styles.cell} ${styles.weekCell}`}
                            >
                              <div className={styles.inlineField}>
                                <label
                                  className={styles.inputLabel}
                                  htmlFor={`${plan.id}-${day.id}-${exercise.id}-week-${weekIndex}-reps`}
                                >
                                  Rep
                                </label>
                                <input
                                  id={`${plan.id}-${day.id}-${exercise.id}-week-${weekIndex}-reps`}
                                  type="text"
                                  inputMode="numeric"
                                  value={weekValue.reps}
                                  placeholder="8"
                                  onChange={(event) =>
                                    updateWeekValue(
                                      plan.id,
                                      day.id,
                                      exercise.id,
                                      weekIndex,
                                      "reps",
                                      event.target.value,
                                    )
                                  }
                                  className={styles.input}
                                />
                              </div>

                              <div className={styles.inlineField}>
                                <label
                                  className={styles.inputLabel}
                                  htmlFor={`${plan.id}-${day.id}-${exercise.id}-week-${weekIndex}-weight`}
                                >
                                  Peso
                                </label>
                                <input
                                  id={`${plan.id}-${day.id}-${exercise.id}-week-${weekIndex}-weight`}
                                  type="text"
                                  inputMode="decimal"
                                  value={weekValue.weight}
                                  placeholder="60"
                                  onChange={(event) =>
                                    updateWeekValue(
                                      plan.id,
                                      day.id,
                                      exercise.id,
                                      weekIndex,
                                      "weight",
                                      event.target.value,
                                    )
                                  }
                                  className={styles.input}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
