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
- Creata la nuova route `/aggiornamento` con dati mock tipizzati: schede con settimane, giorni ed esercizi; card espandibili (una aperta per volta) e grid per settimane con campi editabili di ripetizioni/peso per ogni esercizio. La stringa sotto l’esercizio ora mostra “x” come separatore e le colonne settimana non hanno più l’helper “Ripetizioni · Peso”.
- Styling dedicato in `web/src/app/(main)/aggiornamento/page.module.css` per card, sezioni giorno e tabella settimanale con scroll controllato su mobile; campi rep/peso affiancati con label ellissate, input compatti e griglia interna `minmax(0,1fr)` per adattarsi allo spazio (anche con 8 settimane) senza uscire dalle card.
- Sidebar aggiornata con voce “Aggiornamento” e testo descrittivo allineato alla nuova sezione.
- Persistenza locale: i valori inseriti vengono salvati in `localStorage` (`aggiornamento-plans`) e ripristinati al ritorno sulla pagina, in attesa di un DB reale. Assunzione: persistenza locale è sufficiente per ora e non confligge con il futuro storage server-side.
- Aggiunta la possibilità di rinominare ogni giorno direttamente in `/aggiornamento` (input vicino al titolo del giorno), così non tocchiamo il payload critico di `/inserimento`. L’etichetta viene salvata in `localStorage` e ora ha contrasto esplicito.
- Plan di esempio esteso a 8 settimane per verificare la resa con molte colonne; griglia e input ridotti per restare leggibili con scroll orizzontale. Storage versionato (`aggiornamento-plans-v2`) per forzare il caricamento del nuovo mock da 8 settimane.
- Assunzione: per semplificare la lettura, si apre una sola card alla volta; basta ritoccare lo stato per consentire aperture multiple se servirà.
- Test: `cd web && npm run lint`.
