"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";

type WeekValues = {
  weekNumber?: number;
  reps: string;
  weight: string;
};

type ExercisePlan = {
  id: string;
  name: string;
  targetSets: string;
  targetReps: string;
  note?: string;
  weeks: WeekValues[];
};

type DayPlan = {
  id: string;
  label: string;
  scheduledDate?: string;
  exercises: ExercisePlan[];
};

type TrainingPlan = {
  id: string;
  name: string;
  description: string;
  weeks: number;
  days: DayPlan[];
};

type ModalState = {
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
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
        scheduledDate: "2025-12-10",
        exercises: [
          {
            id: "squat",
            name: "Squat bilanciere",
            targetSets: "3",
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
            targetSets: "4",
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
            targetSets: "3",
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
        scheduledDate: "2025-12-12",
        exercises: [
          {
            id: "ohp",
            name: "Military press",
            targetSets: "3",
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
            targetSets: "3",
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
            targetSets: "3",
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
        scheduledDate: "2025-12-15",
        exercises: [
          {
            id: "rdl",
            name: "Stacco rumeno",
            targetSets: "4",
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
            targetSets: "3",
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
            targetSets: "3",
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
        scheduledDate: "2025-12-11",
        exercises: [
          {
            id: "incline",
            name: "Panca inclinata",
            targetSets: "4",
            targetReps: "8-10",
            weeks: [
              { reps: "10", weight: "60" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "lat",
            name: "Lat machine",
            targetSets: "3",
            targetReps: "12",
            weeks: [
              { reps: "12", weight: "50" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "curl",
            name: "Curl bilanciere",
            targetSets: "3",
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
        scheduledDate: "2025-12-13",
        exercises: [
          {
            id: "legpress",
            name: "Leg press",
            targetSets: "4",
            targetReps: "12",
            weeks: [
              { reps: "12", weight: "180" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "legcurl",
            name: "Leg curl",
            targetSets: "3",
            targetReps: "12-15",
            weeks: [
              { reps: "12", weight: "45" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "calf",
            name: "Calf raise",
            targetSets: "4",
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
        scheduledDate: "2025-12-16",
        exercises: [
          {
            id: "row-machine",
            name: "Rematore macchina",
            targetSets: "3",
            targetReps: "10",
            weeks: [
              { reps: "10", weight: "55" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "pullup",
            name: "Trazioni",
            targetSets: "3",
            targetReps: "max",
            weeks: [
              { reps: "8", weight: "bodyweight" },
              { reps: "", weight: "" },
            ],
          },
          {
            id: "triceps",
            name: "Pushdown cavo",
            targetSets: "3",
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
  const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || "dev-user";
  const [rawPlans, setRawPlans] = useState<TrainingPlan[]>(initialPlans);
  const [plans, setPlans] = useState<TrainingPlan[]>(initialPlans);
  const [openPlanId, setOpenPlanId] = useState<string | null>(null);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [backendAvailable, setBackendAvailable] = useState(false);

  const normalizePlan = useCallback((plan: TrainingPlan): TrainingPlan => {
    return {
      ...plan,
      days: plan.days.map((day) => ({
        ...day,
        scheduledDate: day.scheduledDate ?? "",
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
  }, []);

  const loadPlans = useCallback(
    async (options?: { keepOpenId?: string | null }) => {
      const keepOpenId = options?.keepOpenId ?? null;
      setLoading(true);
      setStatusMessage(null);
      try {
        const response = await fetch("/api/plans", {
          headers: {
            "x-user-id": defaultUserId,
          },
        });
        if (!response.ok) {
          throw new Error("Impossibile caricare le schede dal backend");
        }
        const payload = await response.json();
        const apiPlans = Array.isArray(payload.plans) ? payload.plans : [];
        if (apiPlans.length === 0) {
          setRawPlans(initialPlans);
          setStatusMessage("Nessuna scheda trovata nel backend, uso il mock locale.");
          setOpenPlanId(initialPlans[0]?.id ?? null);
          setBackendAvailable(false);
        } else {
          const normalized = apiPlans.map(normalizePlan);
          setRawPlans(normalized);
          const nextOpenId =
            (keepOpenId && normalized.find((plan) => plan.id === keepOpenId)?.id) ??
            normalized[0]?.id ??
            null;
          setOpenPlanId(nextOpenId);
          setBackendAvailable(true);
        }
      } catch (error) {
        console.error("Errore caricamento schede", error);
        setRawPlans(initialPlans);
        setOpenPlanId(initialPlans[0]?.id ?? null);
        setStatusMessage("Backend non raggiungibile, uso il mock locale.");
        setBackendAvailable(false);
      } finally {
        setLoading(false);
      }
    },
    [defaultUserId, normalizePlan],
  );

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    if (editingPlanId && editingPlanId !== openPlanId) {
      setEditingPlanId(null);
    }
  }, [editingPlanId, openPlanId]);

  useEffect(() => {
    const aggregatePlan = (plan: TrainingPlan): TrainingPlan => {
      return {
        ...plan,
        days: plan.days.map((day, idx) => {
          const exercises = day.exercises.map((exercise) => ({
            ...exercise,
            weeks: Array.from({ length: plan.weeks }, (_, i) => {
              const match = exercise.weeks?.find((w) => w.weekNumber === i + 1);
              return {
                weekNumber: i + 1,
                reps: match?.reps ?? "",
                weight: match?.weight ?? "",
              };
            }),
          }));
          return {
            ...day,
            label: day.label || `Giorno ${idx + 1}`,
            exercises,
          };
        }),
      };
    };

    setPlans(rawPlans.map(aggregatePlan));
  }, [rawPlans]);

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
            "x-user-id": defaultUserId,
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

  const updateDayLabel = (planId: string, dayId: string, label: string, scheduledDate?: string) => {
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
                  scheduledDate,
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
            "x-user-id": defaultUserId,
          },
          body: JSON.stringify({ label, scheduledDate }),
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

  const toggleEditMode = (planId: string) => {
    if (!backendAvailable) {
      setStatusMessage("Abilita il backend per usare le azioni di modifica.");
      return;
    }
    setEditingPlanId((current) => (current === planId ? null : planId));
    setStatusMessage(null);
  };

  const handleDeletePlan = (planId: string, planName: string) => {
    if (!backendAvailable) {
      setStatusMessage("Elimina scheda disponibile solo con backend attivo.");
      return;
    }
    setModal({
      title: "Elimina scheda",
      body: `Confermi l'eliminazione della scheda "${planName}"? L'operazione è definitiva.`,
      confirmLabel: "Elimina",
      cancelLabel: "Annulla",
      variant: "danger",
      onConfirm: async () => {
        setModal(null);
        setActionLoading(true);
        try {
          const response = await fetch(`/api/plans/${planId}`, {
            method: "DELETE",
            headers: { "x-user-id": defaultUserId },
          });
          if (!response.ok) {
            throw new Error("Errore eliminazione scheda");
          }
          await loadPlans();
          setEditingPlanId(null);
          setStatusMessage("Scheda eliminata.");
        } catch (error) {
          console.error("Delete plan error", error);
          setStatusMessage("Eliminazione non riuscita. Riprova.");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleAddDay = async (planId: string) => {
    if (!backendAvailable) {
      setStatusMessage("Aggiungi giorno disponibile solo con backend attivo.");
      return;
    }
    setActionLoading(true);
    try {
      const response = await fetch(`/api/plans/${planId}/days`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": defaultUserId,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error("Errore aggiunta giorno");
      }
      await loadPlans({ keepOpenId: planId });
      setEditingPlanId(planId);
      setStatusMessage("Nuovo giorno aggiunto.");
    } catch (error) {
      console.error("Add day error", error);
      setStatusMessage("Aggiunta giorno non riuscita. Controlla la connessione.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDay = (planId: string, dayId: string, label?: string) => {
    if (!backendAvailable) {
      setStatusMessage("Elimina giorno disponibile solo con backend attivo.");
      return;
    }
    setModal({
      title: "Elimina giorno",
      body: `Vuoi eliminare il giorno "${label || "Senza titolo"}"? Tutti gli esercizi e le settimane associate saranno rimossi.`,
      confirmLabel: "Elimina giorno",
      cancelLabel: "Annulla",
      variant: "danger",
      onConfirm: async () => {
        setModal(null);
        setActionLoading(true);
        try {
          const response = await fetch(`/api/plans/${planId}/days/${dayId}`, {
            method: "DELETE",
            headers: { "x-user-id": defaultUserId },
          });
          if (!response.ok) {
            throw new Error("Errore eliminazione giorno");
          }
          await loadPlans({ keepOpenId: planId });
          setEditingPlanId(planId);
          setStatusMessage("Giorno eliminato.");
        } catch (error) {
          console.error("Delete day error", error);
          setStatusMessage("Eliminazione del giorno non riuscita.");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleAdjustWeeks = (planId: string, action: "add" | "remove") => {
    if (!backendAvailable) {
      setStatusMessage("Gestione settimane disponibile solo con backend attivo.");
      return;
    }
    const isRemove = action === "remove";
    setModal({
      title: isRemove ? "Rimuovi settimana" : "Aggiungi settimana",
      body: isRemove
        ? "Rimuoveremo l'ultima settimana per tutte le colonne. I dati di quell'ultima settimana verranno eliminati."
        : "Aggiungeremo una nuova settimana vuota per tutti gli esercizi.",
      confirmLabel: isRemove ? "Rimuovi" : "Aggiungi",
      cancelLabel: "Annulla",
      variant: isRemove ? "danger" : "primary",
      onConfirm: async () => {
        setModal(null);
        setActionLoading(true);
        try {
          const response = await fetch(`/api/plans/${planId}/weeks`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": defaultUserId,
            },
            body: JSON.stringify({ action }),
          });
          if (!response.ok) {
            throw new Error("Errore aggiornamento settimane");
          }
          await loadPlans({ keepOpenId: planId });
          setEditingPlanId(planId);
          setStatusMessage(
            isRemove ? "Ultima settimana rimossa." : "Nuova settimana aggiunta.",
          );
        } catch (error) {
          console.error("Adjust weeks error", error);
          setStatusMessage("Operazione settimane non riuscita.");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleMoveExercise = async (
    planId: string,
    fromDayId: string,
    exerciseId: string,
    targetDayId: string,
  ) => {
    if (fromDayId === targetDayId) return;
    if (!backendAvailable) {
      setStatusMessage("Spostamento esercizi disponibile solo con backend attivo.");
      return;
    }
    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/plans/${planId}/exercises/${exerciseId}/move`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": defaultUserId,
          },
          body: JSON.stringify({ targetDayId }),
        },
      );
      if (!response.ok) {
        throw new Error("Errore spostamento esercizio");
      }

      setPlans((prev) =>
        prev.map((plan) => {
          if (plan.id !== planId) return plan;
          const sourceDay = plan.days.find((day) => day.id === fromDayId);
          const movedExercise =
            sourceDay?.exercises.find((ex) => ex.id === exerciseId) ?? null;
          if (!movedExercise) {
            return plan;
          }
          return {
            ...plan,
            days: plan.days.map((day) => {
              if (day.id === fromDayId) {
                return {
                  ...day,
                  exercises: day.exercises.filter((ex) => ex.id !== exerciseId),
                };
              }
              if (day.id === targetDayId) {
                return { ...day, exercises: [...day.exercises, movedExercise] };
              }
              return day;
            }),
          };
        }),
      );

      await loadPlans({ keepOpenId: planId });
      setEditingPlanId(planId);
      setStatusMessage("Esercizio spostato.");
    } catch (error) {
      console.error("Move exercise error", error);
      setStatusMessage("Spostamento non riuscito. Riprova.");
    } finally {
      setActionLoading(false);
    }
  };

  const updateExerciseMeta = (
    planId: string,
    dayId: string,
    exerciseId: string,
    field: "name" | "targetSets" | "targetReps" | "note",
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
              exercises: day.exercises.map((exercise) =>
                exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise,
              ),
            };
          }),
        };
      }),
    );
  };

  const persistExerciseMeta = async (planId: string, dayId: string, exerciseId: string) => {
    if (!backendAvailable) {
      setStatusMessage("Aggiornamento esercizio disponibile solo con backend attivo.");
      return;
    }
    const plan = plans.find((p) => p.id === planId);
    const day = plan?.days.find((d) => d.id === dayId);
    const exercise = day?.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) {
      setStatusMessage("Esercizio non trovato.");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/plans/${planId}/exercises/${exerciseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": defaultUserId,
        },
        body: JSON.stringify({
          name: exercise.name,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          note: exercise.note ?? "",
        }),
      });
      if (!response.ok) {
        throw new Error("Errore aggiornamento esercizio");
      }
      setStatusMessage("Esercizio aggiornato.");
    } catch (error) {
      console.error("Persist exercise error", error);
      setStatusMessage("Aggiornamento esercizio non riuscito.");
    } finally {
      setActionLoading(false);
    }
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
          const isEditing = editingPlanId === plan.id;
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
                  <div className={styles.planToolbar}>
                    <div className={styles.toolbarLeft}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => toggleEditMode(plan.id)}
                        disabled={!backendAvailable}
                      >
                        {isEditing ? "Chiudi modifica" : "Modifica"}
                      </button>
                      <p className={styles.toolbarHint}>
                        Le settimane sono condivise per tutta la scheda; le azioni di modifica
                        qui sotto influiscono su tutti i giorni.
                        {!backendAvailable
                          ? " Attiva il backend per usare le azioni di modifica."
                          : ""}
                      </p>
                    </div>
                    {isEditing ? (
                      <div className={styles.toolbarActions}>
                        <button
                          type="button"
                          className={styles.primaryButton}
                          onClick={() => handleAddDay(plan.id)}
                          disabled={actionLoading}
                        >
                          + Giorno
                        </button>
                        <button
                          type="button"
                          className={styles.primaryButton}
                          onClick={() => handleAdjustWeeks(plan.id, "add")}
                          disabled={actionLoading}
                        >
                          + Settimana
                        </button>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => handleAdjustWeeks(plan.id, "remove")}
                          disabled={actionLoading || plan.weeks <= 1}
                        >
                          - Settimana
                        </button>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          onClick={() => handleDeletePlan(plan.id, plan.name)}
                          disabled={actionLoading}
                        >
                          Elimina scheda
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {plan.days.map((day, dayIndex) => (
                    <section key={day.id} className={styles.daySection}>
                      <div className={styles.dayHeader}>
                        <div className={styles.dayHeading}>
                          <p className={styles.dayEyebrow}>Giorno {dayIndex + 1}</p>
                          <div className={styles.dayTitleRow}>
                            <h3 className={styles.dayTitle}>Nome giorno</h3>
                            <div className={styles.dayInputs}>
                              <input
                                type="text"
                                value={day.label}
                                onChange={(event) =>
                                  updateDayLabel(plan.id, day.id, event.target.value, day.scheduledDate)
                                }
                                placeholder="Es. Upper/Lower"
                                className={styles.dayNameInput}
                              />
                              <input
                                type="date"
                                value={day.scheduledDate ?? ""}
                                onChange={(event) =>
                                  updateDayLabel(plan.id, day.id, day.label, event.target.value)
                                }
                                className={styles.dayDateInput}
                                aria-label="Data allenamento"
                              />
                            </div>
                          </div>
                        </div>
                        <div className={styles.dayMeta}>
                          <span className={styles.dayBadge}>
                            {day.exercises.length} esercizi
                          </span>
                          {isEditing ? (
                            <button
                              type="button"
                              className={styles.textButton}
                              onClick={() => handleDeleteDay(plan.id, day.id, day.label)}
                              disabled={actionLoading}
                            >
                              Elimina giorno
                            </button>
                          ) : null}
                        </div>
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
                              {isEditing ? (
                                <>
                                  <div className={styles.exerciseEditRow}>
                                    <input
                                      className={styles.exerciseNameInput}
                                      value={exercise.name}
                                      onChange={(event) =>
                                        updateExerciseMeta(
                                          plan.id,
                                          day.id,
                                          exercise.id,
                                          "name",
                                          event.target.value,
                                        )
                                      }
                                      placeholder="Nome esercizio"
                                    />
                                    <div className={styles.metaInputs}>
                                      <label className={styles.metaLabel}>Serie</label>
                                      <input
                                        className={styles.metaInput}
                                        value={exercise.targetSets}
                                        onChange={(event) =>
                                          updateExerciseMeta(
                                            plan.id,
                                            day.id,
                                            exercise.id,
                                            "targetSets",
                                            event.target.value,
                                          )
                                        }
                                      />
                                      <label className={styles.metaLabel}>Target rep</label>
                                      <input
                                        className={styles.metaInput}
                                        value={exercise.targetReps}
                                        onChange={(event) =>
                                          updateExerciseMeta(
                                            plan.id,
                                            day.id,
                                            exercise.id,
                                            "targetReps",
                                            event.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className={styles.exerciseNote}>
                                    <input
                                      className={styles.noteInput}
                                      value={exercise.note ?? ""}
                                      onChange={(event) =>
                                        updateExerciseMeta(
                                          plan.id,
                                          day.id,
                                          exercise.id,
                                          "note",
                                          event.target.value,
                                        )
                                      }
                                      placeholder="Note (opzionali, solo backend per ora)"
                                    />
                                  </div>
                                  <div className={styles.exerciseActions}>
                                    <div className={styles.moveControl}>
                                      {plan.days.length > 1 ? (
                                        <>
                                          <label className={styles.metaLabel}>Sposta in</label>
                                          <select
                                            value={day.id}
                                            onChange={(event) =>
                                              handleMoveExercise(
                                                plan.id,
                                                day.id,
                                                exercise.id,
                                                event.target.value,
                                              )
                                            }
                                            className={styles.select}
                                            disabled={actionLoading}
                                          >
                                            {plan.days.map((candidate, index) => (
                                              <option key={candidate.id} value={candidate.id}>
                                                {candidate.label || `Giorno ${index + 1}`}
                                              </option>
                                            ))}
                                          </select>
                                        </>
                                      ) : (
                                        <span className={styles.muted}>Solo un giorno presente</span>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      className={styles.primaryButton}
                                      onClick={() => persistExerciseMeta(plan.id, day.id, exercise.id)}
                                      disabled={actionLoading}
                                    >
                                      Salva esercizio
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className={styles.exerciseName}>{exercise.name}</p>
                                  <p className={styles.exerciseMeta}>
                                    {exercise.targetSets} serie x target {exercise.targetReps} reps
                                  </p>
                                </>
                              )}
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

      {modal ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>{modal.title}</h3>
            <p className={styles.modalBody}>{modal.body}</p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setModal(null)}
              >
                {modal.cancelLabel ?? "Annulla"}
              </button>
              <button
                type="button"
                className={
                  modal.variant === "danger" ? styles.dangerButton : styles.primaryButton
                }
                onClick={modal.onConfirm}
              >
                {modal.confirmLabel ?? "Conferma"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
