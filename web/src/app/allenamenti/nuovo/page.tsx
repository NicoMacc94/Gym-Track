"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./page.module.css";

type FormState = {
  scheda: string;
  settimana: string;
  giorno: string;
  data: string;
  esercizio: string;
  serie: string;
  ripetizioni: string;
  peso: string;
  rpe: string;
  note: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type WorkoutPayload = {
  scheda: string;
  settimana: number;
  giorno: number;
  data: string;
  esercizio: string;
  serie: number;
  ripetizioni: number;
  peso?: number;
  rpe?: number;
  note?: string;
};

type IntegerValidationOptions = {
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
};

type NumberValidationResult = { value?: number; error?: string };

const formatToday = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  const local = new Date(now.getTime() - offsetMs);
  return local.toISOString().split("T")[0];
};

const createInitialState = (): FormState => ({
  scheda: "",
  settimana: "",
  giorno: "",
  data: formatToday(),
  esercizio: "",
  serie: "",
  ripetizioni: "",
  peso: "0",
  rpe: "",
  note: "",
});

const parseInteger = (
  value: string,
  { label, required, min, max }: IntegerValidationOptions,
): NumberValidationResult => {
  if (!value) {
    if (required) {
      return { error: `${label} obbligatorio` };
    }
    return { value: undefined };
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return { error: `${label} deve essere un numero intero` };
  }

  if (min !== undefined && parsed < min) {
    return { error: `${label}: minimo ${min}` };
  }

  if (max !== undefined && parsed > max) {
    return { error: `${label}: massimo ${max}` };
  }

  return { value: parsed };
};

const parseNumber = (
  value: string,
  label: string,
  { min, max, required }: { min?: number; max?: number; required?: boolean } = {},
): NumberValidationResult => {
  if (!value) {
    if (required) {
      return { error: `${label} obbligatorio` };
    }
    return { value: undefined };
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return { error: `${label} deve essere un numero` };
  }

  if (min !== undefined && parsed < min) {
    return { error: `${label}: minimo ${min}` };
  }

  if (max !== undefined && parsed > max) {
    return { error: `${label}: massimo ${max}` };
  }

  return { value: parsed };
};

const validateForm = (
  state: FormState,
): { errors: FormErrors; payload?: WorkoutPayload } => {
  const errors: FormErrors = {};

  const scheda = state.scheda.trim();
  const esercizio = state.esercizio.trim();
  const note = state.note.trim();

  if (!scheda) {
    errors.scheda = "Scheda obbligatoria";
  }

  if (!state.data) {
    errors.data = "Data obbligatoria";
  }

  if (!esercizio) {
    errors.esercizio = "Esercizio obbligatorio";
  }

  const settimana = parseInteger(state.settimana, {
    label: "Settimana",
    required: true,
    min: 1,
    max: 7,
  });

  const giorno = parseInteger(state.giorno, {
    label: "Giorno",
    required: true,
    min: 1,
    max: 7,
  });

  const serie = parseInteger(state.serie, {
    label: "Serie",
    required: true,
    min: 1,
    max: 5,
  });

  const ripetizioni = parseInteger(state.ripetizioni, {
    label: "Ripetizioni",
    required: true,
    min: 1,
    max: 50,
  });

  const rpe = parseInteger(state.rpe, {
    label: "RPE",
    min: 1,
    max: 5,
  });

  const peso = parseNumber(state.peso, "Peso", { min: 0, max: 300 });

  if (settimana.error) {
    errors.settimana = settimana.error;
  }

  if (giorno.error) {
    errors.giorno = giorno.error;
  }

  if (serie.error) {
    errors.serie = serie.error;
  }

  if (ripetizioni.error) {
    errors.ripetizioni = ripetizioni.error;
  }

  if (rpe.error) {
    errors.rpe = rpe.error;
  }

  if (peso.error) {
    errors.peso = peso.error;
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const payload: WorkoutPayload = {
    scheda,
    settimana: settimana.value as number,
    giorno: giorno.value as number,
    data: state.data,
    esercizio,
    serie: serie.value as number,
    ripetizioni: ripetizioni.value as number,
    peso: peso.value,
    rpe: rpe.value,
    note: note || undefined,
  };

  return { errors, payload };
};

export default function NewWorkoutPage() {
  const [formData, setFormData] = useState<FormState>(() => createInitialState());
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof FormState];
      return next;
    });
    setSubmitStatus("idle");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateForm(formData);
    if (!result.payload) {
      setErrors(result.errors);
      setSubmitStatus("error");
      return;
    }

    setErrors({});
    console.log("Nuovo allenamento", result.payload);
    setSubmitStatus("success");
    setFormData(createInitialState());
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Nuovo allenamento</p>
          <h1 className={styles.title}>Inserisci un allenamento</h1>
          <p className={styles.lead}>
            Compila il form con i dettagli della sessione. I suggerimenti sui
            range sono opzionali ma aiutano a mantenere i dati consistenti.
          </p>
          <p className={styles.legend}>
            I campi contrassegnati con <span className={styles.required}>*</span>{" "}
            sono obbligatori.
          </p>
        </header>

        {submitStatus === "success" && (
          <div className={styles.success} role="status" aria-live="polite">
            Allenamento registrato in locale. Per ora i dati non vengono
            salvati, ma sono visibili in console.
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="scheda">
                Scheda <span className={styles.required}>*</span>
              </label>
              <input
                id="scheda"
                name="scheda"
                type="text"
                required
                autoComplete="off"
                value={formData.scheda}
                onChange={handleChange}
                className={styles.input}
                placeholder="Esempio: Forza A"
                aria-invalid={Boolean(errors.scheda)}
              />
              {errors.scheda && (
                <p className={styles.error}>{errors.scheda}</p>
              )}
            </div>

            <div className={styles.field}>
              <span className={styles.label}>
                Settimana <span className={styles.required}>*</span>
              </span>
              <div
                className={styles.buttonGroup}
                role="radiogroup"
                aria-label="Seleziona la settimana"
                aria-invalid={Boolean(errors.settimana)}
              >
                {Array.from({ length: 7 }, (_, i) => i + 1).map((value) => {
                  const isActive = formData.settimana === String(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`${styles.chipButton} ${isActive ? styles.chipActive : ""}`}
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, settimana: String(value) }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.settimana;
                          return next;
                        });
                        setSubmitStatus("idle");
                      }}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <p className={styles.hint}>
                Scegli un valore tra 1 e 7; è obbligatoria una sola selezione.
              </p>
              {errors.settimana && (
                <p className={styles.error}>{errors.settimana}</p>
              )}
            </div>

            <div className={styles.field}>
              <span className={styles.label}>
                Giorno <span className={styles.required}>*</span>
              </span>
              <div
                className={styles.buttonGroup}
                role="radiogroup"
                aria-label="Seleziona il giorno"
                aria-invalid={Boolean(errors.giorno)}
              >
                {Array.from({ length: 7 }, (_, i) => i + 1).map((value) => {
                  const isActive = formData.giorno === String(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`${styles.chipButton} ${isActive ? styles.chipActive : ""}`}
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, giorno: String(value) }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.giorno;
                          return next;
                        });
                        setSubmitStatus("idle");
                      }}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <p className={styles.hint}>
                Scegli un valore tra 1 e 7; una sola scelta è ammessa.
              </p>
              {errors.giorno && (
                <p className={styles.error}>{errors.giorno}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="data">
                Data <span className={styles.required}>*</span>
              </label>
              <input
                id="data"
                name="data"
                type="date"
                required
                value={formData.data}
                onChange={handleChange}
                className={styles.input}
                aria-invalid={Boolean(errors.data)}
              />
              {errors.data && <p className={styles.error}>{errors.data}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="esercizio">
                Esercizio <span className={styles.required}>*</span>
              </label>
              <input
                id="esercizio"
                name="esercizio"
                type="text"
                required
                autoComplete="off"
                value={formData.esercizio}
                onChange={handleChange}
                className={styles.input}
                placeholder="Esempio: Squat"
                aria-invalid={Boolean(errors.esercizio)}
              />
              {errors.esercizio && (
                <p className={styles.error}>{errors.esercizio}</p>
              )}
            </div>

            <div className={styles.field}>
              <span className={styles.label}>
                Serie <span className={styles.required}>*</span>
              </span>
              <div
                className={styles.buttonGroup}
                role="radiogroup"
                aria-label="Seleziona il numero di serie"
                aria-invalid={Boolean(errors.serie)}
              >
                {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => {
                  const isActive = formData.serie === String(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`${styles.chipButton} ${isActive ? styles.chipActive : ""}`}
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, serie: String(value) }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.serie;
                          return next;
                        });
                        setSubmitStatus("idle");
                      }}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <p className={styles.hint}>Scegli da 1 a 5; selezione obbligatoria.</p>
              {errors.serie && <p className={styles.error}>{errors.serie}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="ripetizioni">
                Ripetizioni <span className={styles.required}>*</span>
              </label>
              <input
                id="ripetizioni"
                name="ripetizioni"
                type="number"
                required
                min={1}
                max={50}
                step={1}
                inputMode="numeric"
                value={formData.ripetizioni}
                onChange={handleChange}
                className={styles.input}
                aria-invalid={Boolean(errors.ripetizioni)}
              />
              <p className={styles.hint}>
                Intero richiesto, minimo 1, massimo 50.
              </p>
              {errors.ripetizioni && (
                <p className={styles.error}>{errors.ripetizioni}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="peso">
                Peso
              </label>
              <div className={styles.sliderRow}>
                <input
                  id="peso"
                  name="peso"
                  type="range"
                  min={0}
                  max={300}
                  step={0.25}
                  value={formData.peso || "0"}
                  onChange={handleChange}
                  className={styles.slider}
                  aria-valuemin={0}
                  aria-valuemax={300}
                  aria-valuenow={Number(formData.peso || 0)}
                  aria-invalid={Boolean(errors.peso)}
                />
                <span className={styles.sliderValue}>
                  {formData.peso || "0"} kg
                </span>
              </div>
              <p className={styles.hint}>
                Slider 0–300 kg, step 0.25. Minimo 0, nessun valore negativo consentito.
              </p>
              {errors.peso && <p className={styles.error}>{errors.peso}</p>}
            </div>

            <div className={styles.field}>
              <span className={styles.label}>RPE (opzionale)</span>
              <div
                className={styles.buttonGroup}
                role="radiogroup"
                aria-label="Seleziona l'RPE"
                aria-invalid={Boolean(errors.rpe)}
              >
                {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => {
                  const isActive = formData.rpe === String(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`${styles.chipButton} ${isActive ? styles.chipActive : ""}`}
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => {
                        const nextValue = formData.rpe === String(value) ? "" : String(value);
                        setFormData((prev) => ({
                          ...prev,
                          rpe: nextValue,
                        }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.rpe;
                          return next;
                        });
                        setSubmitStatus("idle");
                      }}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <p className={styles.hint}>Se usato, scegli tra 1 e 5.</p>
              {errors.rpe && <p className={styles.error}>{errors.rpe}</p>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="note">
              Note
            </label>
            <textarea
              id="note"
              name="note"
              rows={4}
              value={formData.note}
              onChange={handleChange}
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Note aggiuntive sulla sessione"
              aria-invalid={Boolean(errors.note)}
            />
            {errors.note && <p className={styles.error}>{errors.note}</p>}
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton}>
              Salva allenamento
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                setFormData(createInitialState());
                setErrors({});
                setSubmitStatus("idle");
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
