# Backend MySQL – piano di integrazione

## Scope
- Progettare il backend (API + schema MySQL, Prisma) per supportare le funzionalità già implementate lato frontend: creazione scheda (inserimento), aggiornamento scheda per settimane/giorni/esercizi, consultazione storico.
- Definire modello dati, API REST, step operativi e input necessari (credenziali DB, hosting, auth futura).
- Nessuna modifica codice finché non viene approvato questo piano.

## Stato attuale frontend (recap)
- **Inserimento**: crea una scheda con nome, numero settimane (1–6), numero giorni (1–7); per ogni giorno: lista esercizi con serie/ripetizioni target. Payload è in-page; nessun backend.
- **Aggiornamento**: mostra schede mock; per ogni scheda, giorni ed esercizi; per ogni settimana ci sono campi editabili (ripetizioni/peso) per ogni esercizio. Persiste su `localStorage`.
- **Storico**: tabella mock con log allenamenti (scheda, settimana, giorno, esercizio, serie, ripetizioni, peso, RPE, note).

## Assunzioni iniziali
- Multi-utente: lo schema include `user_id` su tutte le entità; auth verrà collegata dopo con NextAuth (GitHub/Google) e tracciata nel TODO dedicato.
- I campi ripetizioni/peso possono essere stringhe (es. “bodyweight +5”) e non solo numeri.
- Settimane lato UI: 1–8 (limite applicativo), schema non impone limite hard.
- Lato API si usa REST JSON; nessuna necessità di subscriptions in tempo reale.

## Modello dati proposto (MySQL, Prisma)
- `users` (placeholder per quando arriva NextAuth): id, provider_id/subject esterni (quando serviranno), email, display_name, created_at, updated_at. Popolabile più avanti.
- `plans`: id, user_id (FK), name, weeks_count, created_at, updated_at, deleted_at (soft delete opzionale).
- `plan_days`: id, plan_id, order_index, label (nome giorno), created_at, updated_at, deleted_at.
- `plan_exercises`: id, plan_day_id, name, target_sets, target_reps, created_at, updated_at, deleted_at.
- `plan_week_targets` (opzionale): id, plan_exercise_id, week_number, target_reps (string), target_weight (string), created_at, updated_at.
- `plan_week_entries`: id, plan_exercise_id, week_number, actual_reps (string), actual_weight (string), created_at, updated_at.
- `workout_logs`: id, plan_id, plan_day_id, plan_exercise_id, week_number, day_number, date, set_number, reps, weight, rpe, note, created_at, updated_at.
- Indici: FK su plan_id/day_id/exercise_id/user_id; composito (`plan_exercise_id`, `week_number`) per week entries; su logs: (`plan_id`, `week_number`, `day_number`, `date`).

## API REST proposte
- `POST /api/plans`: crea scheda (name, weeks_count, days[] con exercises[]); ritorna plan con ids; associa a `user_id`.
- `GET /api/plans`: lista schede dell’utente (paginazione, filtro nome).
- `GET /api/plans/:id`: dettaglio scheda con giorni, esercizi, entries per settimana (scopo Aggiornamento).
- `PATCH /api/plans/:id`: aggiorna metadati (nome, weeks_count).
- `PATCH /api/plans/:id/days/:dayId`: aggiorna label giorno, riordino via `order_index`.
- `PATCH /api/plans/:id/exercises/:exerciseId`: aggiorna nome/target.
- `PUT /api/plans/:id/exercises/:exerciseId/weeks/:weekNumber`: aggiorna valori inseriti (actual_reps/actual_weight) per una settimana (usato da “Aggiornamento”).
- `GET /api/logs`: elenco storico (filtri: scheda, data, settimana, giorno, esercizio) dell’utente.
- `POST /api/logs`: salva ogni set effettivo (scheda, giorno, esercizio, settimana, set_number, reps, peso, rpe, note).

## Steps operativi (una volta approvato)
1) **Confermare env dev**: variabili `DATABASE_URL` per MySQL locale (senza SSL).
2) **Prisma schema**: definire modelli con `user_id` e timestamp/soft delete dove sensato; generare migrazione iniziale.
3) **TODO-DB backlog**: mantenere attivi i file TODO su auth, provider prod, pooling, audit.
4) **API layer**: route handlers App Router (`app/api/.../route.ts`), validazione (zod), mapping DTO ↔ Prisma.
5) **ACL base**: vincolare query a `user_id` (anche se l’auth reale arriverà dopo), accettando un `user_id` placeholder finché non c’è NextAuth.
6) **Front-end wiring**: Inserimento → `POST /api/plans`; Aggiornamento → `GET /api/plans/:id` + `PUT weeks`; Storico → `GET /api/logs`; aggiungere stati loading/error.
7) **Test**: unit per validators, integrazione minima per create-plan/update-week, `npm run lint`.
8) **Observability**: logging errori API e healthcheck DB; audit avanzato rimandato (vedi TODO).

## Input richiesti dall’utente
- Credenziali DB MySQL (dev locale ora: host, port, user, password, database, ssl no).
- Auth futura: NextAuth con GitHub/Google (rimandata, vedi TODO auth).
- Deploy: Vercel previsto; valutare Data Proxy/pooling più avanti (vedi TODO connessioni).
- Limiti applicativi: settimane 1–8, giorni 1–7, esercizi senza limite hard.
- Backup/audit avanzato: rimandato, vedi TODO dedicato.

## Note su compatibilità frontend
- Non cambiare la forma del payload di Inserimento senza richiesta: mappare direttamente ai modelli DB.
- Aggiornamento: mantenere la griglia settimanale; l’API `PUT weeks/:weekNumber` deve accettare stringhe per rep/peso.
- Storico: popolato da `workout_logs`; può riusare la stessa struttura usata ora nei mock.
