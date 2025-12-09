# Sezione "Aggiornamento" con vista schede e settimane

## Scope
- Aggiungere una nuova voce di navigazione (Sidebar) per accedere a una pagina di aggiornamento schede.
- Creare una pagina che elenca tutte le schede salvate come card verticali, espandibili su tap/click.
- All&apos;apertura di una card mostrare i giorni e, per ogni esercizio, le colonne per settimana con campi modificabili di ripetizioni/peso (valori precompilati se presenti).
- Mantenere il comportamento attuale delle altre pagine (inserimento, storico) senza alterare la struttura dei dati esistenti.

## Approccio
- Introdurre una nuova route sotto il gruppo `(main)` (es. `/aggiornamento`) con componenti client-side per l&apos;interazione (apri/chiudi card, editing dei campi).
- Modellare i dati localmente (mock) in linea con la struttura della scheda: nome, numero settimane, giorni ed esercizi con valori per settimana; preservare l&apos;espandibilità senza backend.
- Definire layout tabellare per ciascuna card: header con nome/metadata, contenuto con sezioni per giorno e colonne per settimana (ripetizioni/peso), responsive su mobile con scroll orizzontale controllato.
- Aggiornare la Sidebar per includere la nuova sezione e mostrare stato attivo; curare lo styling con CSS Module dedicato.

## File chiave (previsti)
- `web/src/app/(main)/aggiornamento/page.tsx` per markup e logica client (espansione card, editing campi).
- `web/src/app/(main)/aggiornamento/page.module.css` per lo styling della nuova vista e della tabella settimanale.
- `web/src/app/(main)/_components/Sidebar.tsx` (+ CSS se necessario) per aggiungere la voce di navigazione.

## Implementation
- `/aggiornamento` ora carica le schede dal backend (`/api/plans` con header `x-user-id`) con fallback al mock solo se il DB è vuoto o non raggiungibile. Una card aperta alla volta, header con meta (settimane/giorni/esercizi) e griglia settimanale per rep/peso.
- Aggiunto “modo modifica” per ogni scheda con toolbar contestuale: aggiunta/rimozione settimana (colonna condivisa a tutta la scheda), aggiunta giorno, eliminazione scheda (modal di conferma). Le settimane rimosse cancellano l’ultima colonna di dati, le settimane aggiunte creano slot vuoti per tutti gli esercizi.
- Azioni per giorno ed esercizio in modifica: eliminazione giorno (modal), rinomina giorno e data allenamento (salvate via `PATCH /plans/:id/days/:dayId`), spostamento esercizi tra giorni (`POST /plans/:id/exercises/:exerciseId/move`), rename target esercizio (nome, serie, target reps, note) con `PATCH /plans/:id/exercises/:exerciseId`. Note: il campo note è gestito lato backend, la UI lo espone come input semplice.
- Input rep/peso compatti e label ellissate per gestire fino a 8 settimane senza uscire dalle card; griglia `minmax(0,1fr)` per i campi settimana, card e contenuti allargati con padding per non sovrapporsi alla Sidebar.
- Modali leggere per azioni distruttive (elimina scheda, elimina giorno, aggiungi/rimuovi settimana) e banner di stato per feedback rapido. I pulsanti disabilitano le azioni durante le chiamate API.
- CSS aggiornato in `web/src/app/(main)/aggiornamento/page.module.css` per toolbar, bottoni primari/secondari/danger, modali e controlli di spostamento esercizi.
- Test: `cd web && npm run lint`.
