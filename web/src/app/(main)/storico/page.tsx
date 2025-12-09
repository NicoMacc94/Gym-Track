"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type WorkoutEntry = {
  scheda: string;
  settimana: number;
  giorno: number;
  data: string;
  esercizio: string;
  serie: number;
  ripetizioni: string;
  peso?: number;
  rpe?: number;
  note?: string;
};

type Filters = {
  search: string;
  scheda: string;
  settimana: string;
  giorno: string;
  from: string;
  to: string;
  rpeMin: string;
};

type SortKey =
  | "data"
  | "scheda"
  | "settimana"
  | "giorno"
  | "esercizio"
  | "serie"
  | "ripetizioni"
  | "peso"
  | "rpe";
type SortDirection = "asc" | "desc";
type SortConfig = { key: SortKey; direction: SortDirection };

type ApiLog = {
  id: string;
  planId?: string;
  planDayId?: string;
  planExerciseId?: string;
  weekNumber?: number;
  dayNumber?: number;
  date?: string;
  setNumber?: number;
  reps?: string | number;
  weight?: string | number;
  rpe?: string | number;
  note?: string;
  esercizio?: string;
  exerciseName?: string;
  scheda?: string;
};

const mockWorkoutEntries: WorkoutEntry[] = [
  {
    scheda: "Forza A",
    settimana: 1,
    giorno: 1,
    data: "2025-12-01",
    esercizio: "Squat",
    serie: 1,
    ripetizioni: "5",
    peso: 120,
    rpe: 4,
    note: "Avvio blocco forza, buona velocità.",
  },
  {
    scheda: "Forza A",
    settimana: 1,
    giorno: 1,
    data: "2025-12-01",
    esercizio: "Squat",
    serie: 2,
    ripetizioni: "5",
    peso: 120,
    rpe: 4,
  },
  {
    scheda: "Forza A",
    settimana: 1,
    giorno: 1,
    data: "2025-12-01",
    esercizio: "Panca piana",
    serie: 1,
    ripetizioni: "6",
    peso: 85,
    rpe: 3,
  },
  {
    scheda: "Forza A",
    settimana: 1,
    giorno: 3,
    data: "2025-12-03",
    esercizio: "Stacco da terra",
    serie: 1,
    ripetizioni: "4",
    peso: 150,
    rpe: 4,
    note: "Grip ok, pausa lunga.",
  },
  {
    scheda: "Forza A",
    settimana: 1,
    giorno: 3,
    data: "2025-12-03",
    esercizio: "Rematore bilanciere",
    serie: 1,
    ripetizioni: "8",
    peso: 60,
    rpe: 3,
  },
  {
    scheda: "Ipertrofia B",
    settimana: 2,
    giorno: 2,
    data: "2025-12-05",
    esercizio: "Lat machine",
    serie: 1,
    ripetizioni: "10",
    peso: 50,
    rpe: 2,
    note: "Focus tecnica.",
  },
  {
    scheda: "Ipertrofia B",
    settimana: 2,
    giorno: 2,
    data: "2025-12-05",
    esercizio: "Lat machine",
    serie: 2,
    ripetizioni: "10",
    peso: 50,
    rpe: 3,
  },
  {
    scheda: "Ipertrofia B",
    settimana: 2,
    giorno: 4,
    data: "2025-12-07",
    esercizio: "Panca inclinata",
    serie: 1,
    ripetizioni: "12",
    peso: 60,
    rpe: 3,
    note: "Ottimo pump.",
  },
  {
    scheda: "Deload",
    settimana: 3,
    giorno: 1,
    data: "2025-12-08",
    esercizio: "Squat",
    serie: 1,
    ripetizioni: "5",
    peso: 90,
    rpe: 2,
    note: "Deload controllato.",
  },
  {
    scheda: "Deload",
    settimana: 3,
    giorno: 1,
    data: "2025-12-08",
    esercizio: "Military press",
    serie: 1,
    ripetizioni: "8",
    peso: 40,
  },
  {
    scheda: "Forza A",
    settimana: 2,
    giorno: 6,
    data: "2025-12-10",
    esercizio: "Panca piana",
    serie: 1,
    ripetizioni: "5",
    peso: 90,
    rpe: 4,
    note: "Progressione mantenuta.",
  },
];

const defaultFilters: Filters = {
  search: "",
  scheda: "",
  settimana: "",
  giorno: "",
  from: "",
  to: "",
  rpeMin: "",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const filterEntries = (entries: WorkoutEntry[], filters: Filters) => {
  const searchTerm = filters.search.trim().toLowerCase();
  return entries.filter((entry) => {
    if (filters.scheda && entry.scheda !== filters.scheda) return false;
    if (filters.settimana && entry.settimana !== Number(filters.settimana)) return false;
    if (filters.giorno && entry.giorno !== Number(filters.giorno)) return false;
    if (filters.from && entry.data < filters.from) return false;
    if (filters.to && entry.data > filters.to) return false;
    if (filters.rpeMin) {
      const minRpe = Number(filters.rpeMin);
      if (entry.rpe === undefined || entry.rpe < minRpe) return false;
    }

    if (searchTerm) {
      const haystack = `${entry.scheda} ${entry.esercizio} ${entry.note ?? ""}`.toLowerCase();
      if (!haystack.includes(searchTerm)) return false;
    }

    return true;
  });
};

const sortValue = (entry: WorkoutEntry, key: SortKey): string | number => {
  switch (key) {
    case "data":
      return Date.parse(entry.data);
    case "scheda":
    case "esercizio":
      return entry[key].toLowerCase();
    case "settimana":
    case "giorno":
    case "serie":
      return entry[key];
    case "ripetizioni":
      return parseFloat(entry.ripetizioni) || 0;
    case "peso":
      return entry.peso ?? -Infinity;
    case "rpe":
      return entry.rpe ?? -Infinity;
    default:
      return 0;
  }
};

const sortEntries = (entries: WorkoutEntry[], sort: SortConfig) => {
  const sorted = [...entries];
  sorted.sort((a, b) => {
    const valueA = sortValue(a, sort.key);
    const valueB = sortValue(b, sort.key);

    if (valueA === valueB) {
      return Date.parse(b.data) - Date.parse(a.data);
    }

    const isAsc = sort.direction === "asc";
    if (valueA > valueB) return isAsc ? 1 : -1;
    return isAsc ? -1 : 1;
  });
  return sorted;
};

const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || "dev-user";

export default function StoricoPage() {
  const [entries, setEntries] = useState<WorkoutEntry[]>(mockWorkoutEntries);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "data",
    direction: "desc",
  });
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setStatusMessage(null);
      try {
        const response = await fetch("/api/logs", {
          headers: { "x-user-id": defaultUserId },
        });
        if (!response.ok) {
          throw new Error("Impossibile recuperare i log dal backend");
        }
        const payload = await response.json();
        const apiLogs = Array.isArray(payload.logs) ? payload.logs : [];
        if (apiLogs.length === 0) {
          setEntries(mockWorkoutEntries);
          setStatusMessage("Nessun log trovato nel backend, uso il mock locale.");
          return;
        }
        const mapped: WorkoutEntry[] = apiLogs.map((log: ApiLog) => {
          const parsedWeight = log.weight !== undefined ? Number.parseFloat(log.weight) : undefined;
          const weight = Number.isFinite(parsedWeight) ? parsedWeight : undefined;
          const parsedRpe = log.rpe !== undefined ? Number.parseFloat(log.rpe) : undefined;
          const rpe = Number.isFinite(parsedRpe) ? parsedRpe : undefined;
          const date = log.date ?? log.data ?? "";
          return {
            scheda: log.planId ?? log.scheda ?? "Scheda",
            settimana: Number(log.weekNumber ?? 1),
            giorno: Number(log.dayNumber ?? 1),
            data: date,
            esercizio: log.exerciseName ?? log.esercizio ?? "Esercizio",
            serie: Number(log.setNumber ?? 1),
            ripetizioni: String(log.reps ?? ""),
            peso: weight,
            rpe,
            note: log.note,
          };
        });
        setEntries(mapped);
      } catch (error) {
        console.error("Errore caricamento log", error);
        setEntries(mockWorkoutEntries);
        setStatusMessage("Backend non raggiungibile, uso il mock locale.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const schedaOptions = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.scheda))).sort((a, b) => a.localeCompare(b)),
    [entries],
  );

  const filteredEntries = useMemo(
    () => filterEntries(entries, filters),
    [entries, filters],
  );

  const sortedEntries = useMemo(
    () => sortEntries(filteredEntries, sortConfig),
    [filteredEntries, sortConfig],
  );

  useEffect(() => {
    setPage(1);
  }, [filters, sortConfig, entries]);

  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedEntries = sortedEntries.slice(startIndex, startIndex + pageSize);

  const activeFilters = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters],
  );

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: key === "data" ? "desc" : "asc" };
    });
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilters });
    setSortConfig({ key: "data", direction: "desc" });
  };

  const sortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "^" : "v";
  };

  const getAriaSort = (key: SortKey) =>
    sortConfig.key === key
      ? sortConfig.direction === "asc"
        ? "ascending"
        : "descending"
      : "none";

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Storico</p>
          <h1 className={styles.title}>Storico allenamenti</h1>
          <p className={styles.lead}>
            Consulta ogni record salvato con la stessa struttura del form di inserimento.
            Filtri, ricerca e ordinamento sono pronti per espansioni future.
          </p>
          <p className={styles.meta}>
            I dati vengono letti dal backend se disponibile; in caso contrario si usa un
            dataset mock locale. Ogni riga replica il payload validato (scheda, settimana,
            giorno, esercizio, serie, ripetizioni, peso, RPE, note).
          </p>
          {loading && <div className={styles.info}>Caricamento log...</div>}
          {!loading && statusMessage && <div className={styles.info}>{statusMessage}</div>}
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Log totali</p>
            <p className={styles.statValue}>{entries.length}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Visibili ora</p>
            <p className={styles.statValue}>{sortedEntries.length}</p>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.controls}>
          <div className={styles.searchRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="search">
                Ricerca globale
              </label>
              <input
                id="search"
                name="search"
                type="search"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
                className={styles.input}
                placeholder="Cerca per scheda, esercizio o note"
              />
              <p className={styles.hint}>Ricerca full-text su scheda, esercizio e note.</p>
            </div>

            <div className={styles.actions}>
              <div className={styles.sortBadge}>
                Ordine: {sortConfig.key} {sortConfig.direction === "asc" ? "ASC" : "DESC"}
              </div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={resetFilters}
                disabled={activeFilters === 0 && sortConfig.key === "data" && sortConfig.direction === "desc"}
              >
                Azzera filtri
              </button>
            </div>
          </div>

          <div className={styles.filtersGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="scheda">
                Scheda
              </label>
              <select
                id="scheda"
                name="scheda"
                className={styles.select}
                value={filters.scheda}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, scheda: event.target.value }))
                }
              >
                <option value="">Tutte</option>
                {schedaOptions.map((scheda) => (
                  <option key={scheda} value={scheda}>
                    {scheda}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="settimana">
                Settimana
              </label>
              <select
                id="settimana"
                name="settimana"
                className={styles.select}
                value={filters.settimana}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, settimana: event.target.value }))
                }
              >
                <option value="">Tutte</option>
                {Array.from({ length: 7 }, (_, i) => i + 1).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="giorno">
                Giorno
              </label>
              <select
                id="giorno"
                name="giorno"
                className={styles.select}
                value={filters.giorno}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, giorno: event.target.value }))
                }
              >
                <option value="">Tutti</option>
                {Array.from({ length: 7 }, (_, i) => i + 1).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="from">
                Data da
              </label>
              <input
                id="from"
                name="from"
                type="date"
                className={styles.input}
                value={filters.from}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, from: event.target.value }))
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="to">
                Data a
              </label>
              <input
                id="to"
                name="to"
                type="date"
                className={styles.input}
                value={filters.to}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, to: event.target.value }))
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="rpe">
                RPE minimo
              </label>
              <select
                id="rpe"
                name="rpe"
                className={styles.select}
                value={filters.rpeMin}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, rpeMin: event.target.value }))
                }
              >
                <option value="">Qualsiasi</option>
                {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                  <option key={value} value={value}>
                    {value}+
                  </option>
                ))}
              </select>
              <p className={styles.hint}>Mostra solo log con RPE pari o superiore.</p>
            </div>
          </div>

          <div className={styles.paginationBar}>
            <div className={styles.field} style={{ flex: "0 0 220px" }}>
              <label className={styles.label} htmlFor="pageSize">
                Righe per pagina
              </label>
              <select
                id="pageSize"
                className={styles.select}
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                {[20, 30, 50, 70].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.pageControls}>
              <button
                type="button"
                className={styles.pageButton}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Precedente
              </button>
              <span className={styles.pageInfo}>
                Pagina {currentPage} di {totalPages}
              </span>
              <button
                type="button"
                className={styles.pageButton}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Successiva
              </button>
            </div>
          </div>

          <div className={styles.summaryRow}>
            <p className={styles.summary}>
              Mostro {pagedEntries.length} di {sortedEntries.length} log
              {activeFilters > 0 ? ` (filtri attivi: ${activeFilters})` : " (nessun filtro)"}
            </p>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          {sortedEntries.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Nessun risultato</p>
              <p className={styles.emptyCopy}>
                Modifica la ricerca o i filtri per trovare i log di interesse.
              </p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" aria-sort={getAriaSort("data")}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort("data")}
                    >
                      <span>Data</span>
                      <span className={styles.sortIndicator}>{sortIndicator("data")}</span>
                    </button>
                  </th>
                  <th scope="col" aria-sort={getAriaSort("scheda")}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort("scheda")}
                    >
                      <span>Scheda</span>
                      <span className={styles.sortIndicator}>{sortIndicator("scheda")}</span>
                    </button>
                  </th>
                  <th scope="col" className={styles.numericHeader} aria-sort={getAriaSort("settimana")}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort("settimana")}
                    >
                      <span>Settimana</span>
                      <span className={styles.sortIndicator}>{sortIndicator("settimana")}</span>
                    </button>
                  </th>
                  <th scope="col" className={styles.numericHeader} aria-sort={getAriaSort("giorno")}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort("giorno")}
                    >
                      <span>Giorno</span>
                      <span className={styles.sortIndicator}>{sortIndicator("giorno")}</span>
                    </button>
                  </th>
                  <th scope="col" aria-sort={getAriaSort("esercizio")}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort("esercizio")}
                    >
                      <span>Esercizio</span>
                      <span className={styles.sortIndicator}>{sortIndicator("esercizio")}</span>
                    </button>
                  </th>
                  <th scope="col" className={styles.numericHeader} aria-sort={getAriaSort("serie")}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort("serie")}
                    >
                      <span>Serie</span>
                      <span className={styles.sortIndicator}>{sortIndicator("serie")}</span>
                    </button>
                  </th>
                  <th scope="col" className={styles.numericHeader} aria-sort={getAriaSort("ripetizioni")}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort("ripetizioni")}
                    >
                      <span>Ripetizioni</span>
                      <span className={styles.sortIndicator}>
                        {sortIndicator("ripetizioni")}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className={styles.numericHeader} aria-sort={getAriaSort("peso")}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort("peso")}
                    >
                      <span>Peso</span>
                      <span className={styles.sortIndicator}>{sortIndicator("peso")}</span>
                    </button>
                  </th>
                  <th scope="col" className={styles.numericHeader} aria-sort={getAriaSort("rpe")}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => handleSort("rpe")}
                    >
                      <span>RPE</span>
                      <span className={styles.sortIndicator}>{sortIndicator("rpe")}</span>
                    </button>
                  </th>
                  <th scope="col">Note</th>
                </tr>
              </thead>
              <tbody>
                {pagedEntries.map((entry, index) => (
                  <tr key={`${entry.data}-${entry.scheda}-${entry.esercizio}-${entry.serie}-${index}`}>
                    <td>
                      <div className={styles.cellPrimary}>{formatDate(entry.data)}</div>
                      <p className={styles.cellMeta}>
                        Settimana {entry.settimana} · Giorno {entry.giorno}
                      </p>
                    </td>
                    <td>
                      <span className={styles.badge}>{entry.scheda}</span>
                    </td>
                    <td className={styles.numeric}>{entry.settimana}</td>
                    <td className={styles.numeric}>{entry.giorno}</td>
                    <td>
                      <div className={styles.cellPrimary}>{entry.esercizio}</div>
                    </td>
                    <td className={styles.numeric}>#{entry.serie}</td>
                    <td className={styles.numeric}>
                      {entry.ripetizioni && entry.ripetizioni.trim() !== ""
                        ? entry.ripetizioni
                        : "—"}
                    </td>
                    <td className={styles.numeric}>
                      {entry.peso === undefined ? "—" : `${entry.peso} kg`}
                    </td>
                    <td className={styles.numeric}>{entry.rpe ?? "—"}</td>
                    <td className={styles.note}>{entry.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
