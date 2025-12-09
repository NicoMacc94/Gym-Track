# Backend MySQL – piano di integrazione

## Scope
- Progettare il backend (API + schema MySQL) per supportare le funzionalità già implementate lato frontend: creazione scheda (inserimento), aggiornamento scheda per settimane/giorni/esercizi, consultazione storico.
- Definire modello dati, API REST, step operativi e input necessari dall’utente (credenziali DB, hosting, auth).
- Nessuna modifica codice finché non viene approvato questo piano.

## Stato attuale frontend (recap)
- **Inserimento**: crea una scheda con nome, numero settimane (1–6), numero giorni (1–7); per ogni giorno: lista esercizi con serie/ripetizioni target. Payload è in-page; nessun backend.
- **Aggiornamento**: mostra schede mock; per ogni scheda, giorni ed esercizi; per ogni settimana ci sono campi editabili (ripetizioni/peso) per ogni esercizio. Persiste su `localStorage`.
- **Storico**: tabella mock con log allenamenti (scheda, settimana, giorno, esercizio, serie, ripetizioni, peso, RPE, note).

## Assunzioni iniziali
- Gestione utenti non presente: se serve multi-utente, va aggiunto un livello `users` e auth (JWT/NextAuth).
- I campi ripetizioni/peso possono essere string (es. “bodyweight +5”) e non solo numeri.
- Settimane per scheda sono al massimo 8 (oggi mock 8); schema deve supportare numeri maggiori senza problemi.
- Lato API si usa REST JSON; nessuna necessità di subscriptions in tempo reale.

## Modello dati proposto (MySQL)
- `plans` (schede): id, user_id (nullable se single-tenant), name, weeks_count, created_at, updated_at.
- `plan_days`: id, plan_id, order_index, label (nome giorno), created_at.
- `plan_exercises`: id, plan_day_id, name, target_sets, target_reps, created_at.
- `plan_week_targets`: id, plan_exercise_id, week_number, target_reps (string), target_weight (string) — opzionale, se vogliamo differenziare target per settimana.
- `plan_week_entries`: id, plan_exercise_id, week_number, actual_reps (string), actual_weight (string), created_at, updated_at.
- `workout_logs` (per “storico”): id, plan_id, plan_day_id, plan_exercise_id, settimana, giorno, data, serie, ripetizioni, peso, rpe, note, created_at.
- Indici: FK su plan_id/day_id/exercise_id; indice composito su (`plan_exercise_id`, `week_number`) per `plan_week_entries`.

## API REST proposte
- `POST /api/plans`: crea scheda (name, weeks_count, days[] con exercises[]); ritorna plan con ids.
- `GET /api/plans`: lista schede (paginazione, filtro per nome).
- `GET /api/plans/:id`: dettaglio scheda con giorni, esercizi, entries per settimana.
- `PATCH /api/plans/:id`: aggiorna metadati (nome, weeks_count).
- `PATCH /api/plans/:id/days/:dayId`: aggiorna label giorno, riordino via `order_index`.
- `PATCH /api/plans/:id/exercises/:exerciseId`: aggiorna nome/target.
- `PUT /api/plans/:id/exercises/:exerciseId/weeks/:weekNumber`: aggiorna valori inseriti (actual_reps/actual_weight) per una settimana (usato da “Aggiornamento”).
- `GET /api/logs`: elenco storico (filtri: scheda, data, settimana, giorno, esercizio).
- `POST /api/logs`: salva log (per storicizzare serie/peso/rpe/note) — opzionale se vogliamo registrare i set effettivi oltre al campo “aggiornamento”.

## Steps operativi (una volta approvato)
1) **Confermare requisiti**: multi-utente sì/no; auth (JWT/NextAuth); deploy target (Vercel serverless? altra infrastruttura).
2) **Provision DB MySQL**: endpoint, porta, utente, password, database name; abilitare SSL se richiesto dal provider.
3) **Migrazioni schema**: usare prisma/knex/sequelize? (scelta consigliata: Prisma per typing con Next.js). Definire modelli e generare migrazioni.
4) **API layer**: creare route handlers Next.js App Router (`app/api/.../route.ts`), validazione input (zod), mapping DTO → DB.
5) **Auth/ACL**: se multi-utente, legare tutte le query a `user_id`.
6) **Front-end wiring**: sostituire mock/in-memory con fetch alle API in Inserimento, Aggiornamento, Storico; gestire loading/error; invalidare cache client.
7) **Test**: unit per DTO/validators; e2e minimo per create-plan e update-week-entries; `npm run lint` + eventuali integrazioni.
8) **Observability**: logging errori API (pino/console), healthcheck DB.

## Input richiesti dall’utente
- Credenziali DB MySQL (host, port, user, password, database, ssl sì/no).
- Scelta auth (nessuna/single-tenant vs multi-utente con provider).
- Ambiente di deploy (Vercel serverless? altro) per tarare connessioni (pooling, Data Proxy se Prisma).
- Limiti di settimane/giorni/esercizi (oggi 8/7/∞); confermare vincoli hard.
- Necessità di audit/logging aggiuntivo o backup pianificato.

## Note su compatibilità frontend
- Non cambiare la forma del payload di Inserimento senza richiesta: mappare direttamente ai modelli DB.
- Aggiornamento: mantenere la griglia settimanale; l’API `PUT weeks/:weekNumber` deve accettare stringhe per rep/peso.
- Storico: popolato da `workout_logs`; può riusare la stessa struttura usata ora nei mock.
