# Implementazione backend MySQL/Prisma (piano esecutivo)

## Scope
- Integrare un backend minimale per le feature già presenti lato frontend (Inserimento, Aggiornamento, Storico) usando MySQL + Prisma.
- Esporre API REST App Router per creare piani, leggere/aggiornare week entries, registrare log di workout.
- Integrare il frontend con le API mantenendo fallback locale (mock) quando il DB non è disponibile.

## Approccio
- Aggiungere Prisma e schema DB con `user_id`, timestamp e soft delete dove serve; includere week entries e workout logs.
- Creare API handlers: `POST/GET /plans`, `GET /plans/:id`, `PUT /plans/:id/exercises/:exerciseId/weeks/:weekNumber`, `GET/POST /logs`.
- Gestire placeholder `user_id` (es. `dev-user`) finché l’autenticazione non è attiva; tracciare gli aspetti rimandati nei file TODO-DB.
- Aggiornare il frontend:
  - Inserimento: POST `/api/plans`.
  - Aggiornamento: fetch `/api/plans` (o `/plans/:id`) con fallback ai mock/localStorage; PUT week entries.
  - Storico: fetch `/api/logs` con fallback mock.
- Validazione payload con zod o controlli mirati; error handling con messaggi chiari.

## File chiave previsti
- `web/prisma/schema.prisma`, `web/src/lib/prisma.ts`.
- API routes in `web/src/app/api/plans/*`, `web/src/app/api/logs/route.ts`.
- Aggiornamenti frontend: `web/src/app/(main)/inserimento/page.tsx`, `web/src/app/(main)/aggiornamento/page.tsx`, eventuali util in `web/src/lib/`.
- Documentazione TODO-DB già creata; aggiornare questo doc con la sezione “Implementation”.

## Implementation
- Aggiunti Prisma e dipendenze (`@prisma/client`, `prisma`, `zod`), script `prisma:generate`, `.env.example` con `DATABASE_URL` e `DEFAULT_USER_ID`.
- Definito schema MySQL in `web/prisma/schema.prisma` con modelli per users (placeholder), plans, days, exercises, week targets/entries, workout logs, timestamp e soft delete dove sensato.
- Creato Prisma client condiviso `web/src/lib/prisma.ts` e helper utente placeholder `web/src/lib/current-user.ts` (header `x-user-id` o `DEFAULT_USER_ID`).
- API REST:
  - `POST/GET /api/plans`, `GET /api/plans/:id`.
  - Mutazioni struttura: `POST /plans/:id/days` (crea giorno), `PATCH/DELETE /plans/:id/days/:dayId` (rename/elimina), `PATCH /plans/:id/weeks` (add/remove ultima settimana), `POST /plans/:id/exercises/:exerciseId/move` (sposta esercizio su un altro giorno), `PATCH /plans/:id/exercises/:exerciseId` (rename + target + note), `DELETE /plans/:id` (elimina scheda).
  - Valori settimanali: `PUT /plans/:id/exercises/:exerciseId/weeks/:weekNumber`.
  - `GET/POST /api/logs` per lo storico per-set.
- Frontend:
  - Inserimento invia `POST /api/plans` con modal di successo e reset del form.
  - Aggiornamento: carica da `/api/plans` (fallback mock solo se vuoto/down), salva rep/peso, label giorno e data, permette rename esercizi + note, sposta esercizi, aggiunge/rimuove settimane e giorni, elimina scheda/giorni con modali; tutte le azioni collegate alle nuove API.
  - Storico legge da `/api/logs` con paginazione lato client (page size configurabile) e fallback mock.
- TODO-DB già popolati per auth, provider prod, connessioni/pooling, audit/logging.
- Campi aggiuntivi: `scheduledDate` sui giorni e `note` sugli esercizi (gestiti lato UI e API). Settimane/dati per esercizio ora sono coerenti con il numero di settimane della scheda, anche dopo add/remove.
- Seed: `node scripts/seed-plan.js` importa `data/PALE-4-scheda-fase-3-p-min-esp.json`, normalizzando i pesi ai soli numeri (es. “10 kg per lato” → `10`, “10/7.5/5 kg” → `10/7.5/5`), con note ed esercizi distribuiti su giorni/settimane; creati week entries e log base.
- Test eseguiti: `cd web && npm run lint`.
