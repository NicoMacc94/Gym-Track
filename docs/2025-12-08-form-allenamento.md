# Form allenamento - pianificazione

## Scopo della feature
Creare una pagina/route con un form per inserire un allenamento, includendo i campi indicati con relative regole di validazione lato client, e gestire temporaneamente il submit senza backend (log/simulazione in memoria).

## Campi del form e validazione lato client
- Scheda: stringa, obbligatoria (`required`, `minLength` > 0).
- Settimana: intero, opzionale; range consigliato 1–12 (`type="number"`, `min=1`, `max=12`), validazione custom per forzare intero se valorizzato.
- Giorno: intero, opzionale; range consigliato 1–7 (`type="number"`, `min=1`, `max=7`), validazione custom per forzare intero se valorizzato.
- Data: data, obbligatoria (`type="date"`, `required`).
- Esercizio: stringa, obbligatoria (`required`, `minLength` > 0).
- Serie: intero, obbligatorio (`required`, `type="number"`, `min=1`, `max=10`), validazione custom per intero.
- Ripetizioni: intero, obbligatorio (`required`, `type="number"`, `min=1`, `max=50`), validazione custom per intero.
- Peso: numero, opzionale (`type="number"`, nessun min/max specificato).
- RPE: intero, opzionale; range 1–10 (`type="number"`, `min=1`, `max=10`), validazione custom per intero se valorizzato.
- Note: testo libero, opzionale (`textarea`).

## File/route previsti (web/)
- `web/src/app/allenamenti/nuovo/page.tsx`: nuova route App Router con form e logica client-side.
- `web/src/app/allenamenti/nuovo/page.module.css`: stile scoped per il form (layout, spacing, hint sui range).
- Eventuale refactor minimo in `web/src/app/layout.tsx` solo se serve un wrapper comune (non previsto al momento).

## Approccio alla validazione lato client
- Usare attributi HTML (`required`, `type`, `min`, `max`, `step="1"`) per bloccare input non valido.
- Aggiungere controlli JavaScript al submit per garantire valori interi dove richiesto e segnalare errori con messaggi inline.
- Nessuna libreria esterna prevista: la validazione resta built-in + logica custom leggera (riduce dipendenze e segue le guideline attuali).

## Strategia temporanea per la gestione dei dati in submit
- Gestione client-side con stato locale: all submit prevenire default, validare e fare `console.log` dell'oggetto allenamento.
- Mostrare un piccolo messaggio di successo inline (es. stato locale) e resettare il form se valido.
- Nessun backend o persistenza: nessuna chiamata di rete, niente storage persistente per ora.

## Implementazione effettuata
- Creato route `web/src/app/allenamenti/nuovo/page.tsx` con form client-side, validazione built-in + controlli custom per interi e range, gestione errori inline, stato di successo e reset.
- Aggiunto stile scoped in `web/src/app/allenamenti/nuovo/page.module.css` per layout, griglia dei campi, messaggi, bottoni e stato di successo.
- Gestione dati submit: prevenzione default, validazione, costruzione payload tipizzato, `console.log` e reset; nessuna persistenza/back-end.
- Dipendenze: nessuna libreria esterna aggiunta.
- Test/lint: `npm run lint` (da `web/`) completato con successo.
