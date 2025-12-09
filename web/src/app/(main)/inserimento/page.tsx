"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import styles from "./page.module.css";

type ExerciseForm = {
  id: string;
  name: string;
  sets: string;
  reps: string;
};

type DayPlan = {
  id: string;
  exercises: ExerciseForm[];
};

type ScheduleFormState = {
  name: string;
  weeks: number;
  days: number;
};

type FormErrors = {
  name?: string;
};

const createExercise = (id: string): ExerciseForm => ({
  id,
  name: "",
  sets: "",
  reps: "",
});

const createInitialDay = (): DayPlan => ({
  id: "day-1",
  exercises: [createExercise("ex-1")],
});

export default function NewPlanPage() {
  const dayIdCounter = useRef(2);
  const exerciseIdCounter = useRef(2);

  const createDayWithExercise = (): DayPlan => {
    const dayId = `day-${dayIdCounter.current++}`;
    const exerciseId = `ex-${exerciseIdCounter.current++}`;
    return {
      id: dayId,
      exercises: [createExercise(exerciseId)],
    };
  };

  const [schedule, setSchedule] = useState<ScheduleFormState>({
    name: "",
    weeks: 1,
    days: 1,
  });
  const [days, setDays] = useState<DayPlan[]>(() => [createInitialDay()]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSchedule((prev) => ({ ...prev, name: event.target.value }));
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
    setSubmitStatus("idle");
  };

  const updateDaysCount = (nextValue: number) => {
    const clamped = Math.min(7, Math.max(1, nextValue));
    setSchedule((prev) => ({ ...prev, days: clamped }));
    setDays((prev) => {
      let nextDays: DayPlan[] = prev;
      if (clamped > prev.length) {
        const additional = Array.from({ length: clamped - prev.length }, () =>
          createDayWithExercise(),
        );
        nextDays = [...prev, ...additional];
      } else if (clamped < prev.length) {
        nextDays = prev.slice(0, clamped);
      }
      setSelectedDayIndex((current) => Math.min(current, nextDays.length - 1));
      return nextDays;
    });
    setSubmitStatus("idle");
  };

  const handleWeeksSelect = (value: number) => {
    setSchedule((prev) => ({ ...prev, weeks: value }));
    setSubmitStatus("idle");
  };

  const handleDaysSelect = (value: number) => {
    updateDaysCount(value);
  };

  const moveDay = (dayId: string, direction: "up" | "down") => {
    setDays((prev) => {
      const currentIndex = prev.findIndex((day) => day.id === dayId);
      if (currentIndex === -1) {
        return prev;
      }
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }
      const nextDays = [...prev];
      const [target] = nextDays.splice(currentIndex, 1);
      nextDays.splice(targetIndex, 0, target);
      setSelectedDayIndex((currentSelected) => {
        if (currentSelected === currentIndex) {
          return targetIndex;
        }
        if (currentIndex < targetIndex) {
          if (currentSelected > currentIndex && currentSelected <= targetIndex) {
            return currentSelected - 1;
          }
        } else if (currentIndex > targetIndex) {
          if (currentSelected < currentIndex && currentSelected >= targetIndex) {
            return currentSelected + 1;
          }
        }
        return currentSelected;
      });
      return nextDays;
    });
  };

  const handleExerciseChange = (
    dayId: string,
    exerciseId: string,
    field: keyof ExerciseForm,
    value: string,
  ) => {
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, [field]: value }
                  : exercise,
              ),
            }
          : day,
      ),
    );
    setSubmitStatus("idle");
  };

  const addExercise = (dayId: string) => {
    const newExerciseId = `ex-${exerciseIdCounter.current++}`;
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? { ...day, exercises: [...day.exercises, createExercise(newExerciseId)] }
          : day,
      ),
    );
    setSubmitStatus("idle");
  };

  const removeExercise = (dayId: string, exerciseId: string) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId || day.exercises.length === 1) {
          return day;
        }
        const nextExercises = day.exercises.filter(
          (exercise) => exercise.id !== exerciseId,
        );
        return { ...day, exercises: nextExercises };
      }),
    );
    setSubmitStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!schedule.name.trim()) {
      setErrors({ name: "Nome scheda obbligatorio" });
      return;
    }

    setSubmitStatus("loading");
    setSubmitMessage(null);

    const payload = {
      name: schedule.name.trim(),
      weeksCount: schedule.weeks,
      days: days.map((day, index) => ({
        label: `Giorno ${index + 1}`,
        orderIndex: index,
        exercises: day.exercises.map((exercise) => ({
          name: exercise.name.trim(),
          targetSets: exercise.sets.trim(),
          targetReps: exercise.reps.trim(),
        })),
      })),
    };

    try {
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "dev-user",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || "Impossibile salvare la scheda");
      }

      const data = await response.json();
      setSubmitStatus("success");
      setSubmitMessage(`Scheda salvata: ${data.plan?.name ?? "creata"}.`);
    } catch (error) {
      console.error("Errore salvataggio scheda", error);
      setSubmitStatus("error");
      setSubmitMessage("Salvataggio non riuscito. Controlla la connessione al backend.");
    }
  };

  const activeDay = days[selectedDayIndex];

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Nuova scheda</p>
          <h1 className={styles.title}>Configura una nuova scheda</h1>
          <p className={styles.lead}>
            Prima definisci le info generali, poi imposta gli esercizi giorno per giorno.
            I giorni sono mostrati come cartelle: seleziona Giorno 1..N, riordina e lavora
            sui relativi esercizi senza perdere i dati.
          </p>
        </header>

        {submitStatus === "success" && (
          <div className={styles.success} role="status" aria-live="polite">
            {submitMessage ?? "Scheda salvata."}
          </div>
        )}
        {submitStatus === "error" && submitMessage && (
          <div className={styles.errorBanner} role="alert">
            {submitMessage}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>Generale</p>
              <div>
                <h2 className={styles.sectionTitle}>Dati scheda</h2>
                <p className={styles.sectionLead}>
                  Nome, numero settimane (1-6) e numero giorni (1-7) guidano la struttura
                  che definisci sotto.
                </p>
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="nomeScheda">
                  Nome scheda <span className={styles.required}>*</span>
                </label>
                <input
                  id="nomeScheda"
                  name="nomeScheda"
                  type="text"
                  required
                  autoComplete="off"
                  value={schedule.name}
                  onChange={handleNameChange}
                  className={styles.input}
                  placeholder="Esempio: Forza 6 settimane"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>

              <div className={styles.field}>
                <span className={styles.label}>
                  Numero settimane <span className={styles.required}>*</span>
                </span>
                <div
                  className={styles.buttonGroup}
                  role="radiogroup"
                  aria-label="Seleziona il numero di settimane"
                >
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((value) => {
                    const isActive = schedule.weeks === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`${styles.chipButton} ${isActive ? styles.chipActive : ""}`}
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => handleWeeksSelect(value)}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
                <p className={styles.hint}>Range consentito: 1–6 settimane.</p>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>
                  Numero giorni <span className={styles.required}>*</span>
                </span>
                <div
                  className={styles.buttonGroup}
                  role="radiogroup"
                  aria-label="Seleziona il numero di giorni"
                >
                  {Array.from({ length: 7 }, (_, i) => i + 1).map((value) => {
                    const isActive = schedule.days === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`${styles.chipButton} ${isActive ? styles.chipActive : ""}`}
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => handleDaysSelect(value)}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
                <p className={styles.hint}>
                  Aggiornando questo valore aggiungi o rimuovi cartelle giorno in coda.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionEyebrow}>Giorni</p>
                <h2 className={styles.sectionTitle}>Esercizi per giorno</h2>
                <p className={styles.sectionLead}>
                  Seleziona la cartella del giorno, gestisci gli esercizi di quel giorno e
                  riordina i giorni senza perdere il contenuto.
                </p>
              </div>
            </div>

            <div className={styles.daySelector} role="tablist" aria-label="Seleziona il giorno">
              {days.map((day, index) => {
                const isActive = index === selectedDayIndex;
                return (
                  <button
                    key={day.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.chipButton} ${isActive ? styles.chipActive : ""}`}
                    onClick={() => setSelectedDayIndex(index)}
                  >
                    Giorno {index + 1}
                  </button>
                );
              })}
            </div>
            <p className={styles.hint}>
              Scegli la cartella giorno da modificare; il numero del giorno segue l’ordine
              corrente e viene usato nel payload finale.
            </p>

            {activeDay && (
              <div className={styles.dayCard}>
                <div className={styles.dayHeader}>
                  <div>
                    <p className={styles.dayKicker}>Cartella Giorno {selectedDayIndex + 1}</p>
                    <p className={styles.dayMeta}>
                      La posizione della cartella determina il numero del giorno. Puoi
                      riordinarla senza perdere gli esercizi.
                    </p>
                  </div>
                  <div className={styles.dayActions}>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={() => moveDay(activeDay.id, "up")}
                      disabled={selectedDayIndex === 0}
                    >
                      Sposta su
                    </button>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={() => moveDay(activeDay.id, "down")}
                      disabled={selectedDayIndex === days.length - 1}
                    >
                      Sposta giù
                    </button>
                  </div>
                </div>

                <div className={styles.exerciseList}>
                  {activeDay.exercises.map((exercise, exIndex) => (
                    <div key={exercise.id} className={styles.exerciseRow}>
                      <div className={styles.field}>
                        <label
                          className={styles.label}
                          htmlFor={`exercise-${activeDay.id}-${exercise.id}`}
                        >
                          Nome esercizio
                        </label>
                        <input
                          id={`exercise-${activeDay.id}-${exercise.id}`}
                          type="text"
                          autoComplete="off"
                          value={exercise.name}
                          onChange={(event) =>
                            handleExerciseChange(
                              activeDay.id,
                              exercise.id,
                              "name",
                              event.target.value,
                            )
                          }
                          className={styles.input}
                          placeholder={`Esempio: Esercizio ${exIndex + 1}`}
                        />
                      </div>

                      <div className={styles.field}>
                        <label
                          className={styles.label}
                          htmlFor={`sets-${activeDay.id}-${exercise.id}`}
                        >
                          Numero serie
                        </label>
                        <input
                          id={`sets-${activeDay.id}-${exercise.id}`}
                          type="text"
                          inputMode="numeric"
                          value={exercise.sets}
                          onChange={(event) =>
                            handleExerciseChange(
                              activeDay.id,
                              exercise.id,
                              "sets",
                              event.target.value,
                            )
                          }
                          className={styles.input}
                          placeholder="4"
                        />
                      </div>

                      <div className={styles.field}>
                        <label
                          className={styles.label}
                          htmlFor={`reps-${activeDay.id}-${exercise.id}`}
                        >
                          Numero ripetizioni
                        </label>
                        <input
                          id={`reps-${activeDay.id}-${exercise.id}`}
                          type="text"
                          inputMode="numeric"
                          value={exercise.reps}
                          onChange={(event) =>
                            handleExerciseChange(
                              activeDay.id,
                              exercise.id,
                              "reps",
                              event.target.value,
                            )
                          }
                          className={styles.input}
                          placeholder="8-10"
                        />
                      </div>

                      {activeDay.exercises.length > 1 && (
                        <button
                          type="button"
                          className={styles.ghostButton}
                          onClick={() => removeExercise(activeDay.id, exercise.id)}
                        >
                          Rimuovi esercizio
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => addExercise(activeDay.id)}
                  >
                    + Aggiungi esercizio
                  </button>
                </div>
              </div>
            )}
          </section>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton}>
              Salva scheda
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                setSchedule({ name: "", weeks: 1, days: 1 });
                dayIdCounter.current = 2;
                exerciseIdCounter.current = 2;
                setDays([createInitialDay()]);
                setErrors({});
                setSubmitStatus("idle");
                setSelectedDayIndex(0);
              }}
            >
              Reimposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
