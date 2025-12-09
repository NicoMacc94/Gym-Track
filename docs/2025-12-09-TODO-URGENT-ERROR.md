# Errori urgenti da risolvere (backend API piani)

## Contesto
- Ambiente: Next.js 16.0.7 (Turbopack), API App Router sotto `/api/plans`.
- Backend MySQL attivo; chiamate da pagina `/aggiornamento`.

## Errori riscontrati
1) **params è Promise nelle route dinamiche**
   - Messaggio: `Route "/api/plans/[id]" used params.id. params is a Promise...`
   - File: `src/app/api/plans/[id]/route.ts` (DELETE).
   - Effetto: `planId` risulta `undefined`, Prisma lancia `PlanWhereUniqueInput needs id`.

2) **Stesso problema su weeks**
   - Messaggio: `Route "/api/plans/[id]/weeks" used params.id. params is a Promise...`
   - File: `src/app/api/plans/[id]/weeks/route.ts` (PATCH).
   - Effetto: transazione `plan.update` e `planWeekEntry.createMany` ricevono `id: undefined` → errore Prisma di validation.

3) **Chiamata di eliminazione scheda fallisce**
   - Stack Prisma: `plan.delete({ where: { id: undefined } })`.
   - Causa: stesso problema di params non unwrapped + forse tipizzazione dinamica con Turbopack.

## Note operative
- Serve adeguare le route dinamiche App Router per estrarre `params` con `await`/`React.use()` (per Turbopack), o ristrutturare la firma dei handler per Next 16.
- Finché non sistemato, le azioni: elimina scheda, aggiungi/rimuovi settimana falliscono in runtime.
- Nessuna modifica applicata al codice in questa nota; ticket per fix successivo.
