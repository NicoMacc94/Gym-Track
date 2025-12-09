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
  - `POST/GET /api/plans`, `GET /api/plans/:id`, `PATCH /plans/:id/days/:dayId`, `PUT /plans/:id/exercises/:exerciseId/weeks/:weekNumber`.
  - `GET/POST /api/logs` per lo storico per-set.
- Frontend:
  - Inserimento ora invia `POST /api/plans` (fallback messaggi di errore/successo).
  - Aggiornamento legge da `/api/plans` con fallback ai mock, salva rep/peso e label giorno via API (messaggi di fallback se backend assente).
  - Storico tenta `GET /api/logs` con fallback ai dati mock, mostra banner di stato.
- TODO-DB già popolati per auth, provider prod, connessioni/pooling, audit/logging.
- Test eseguiti: `cd web && npm run lint`.
