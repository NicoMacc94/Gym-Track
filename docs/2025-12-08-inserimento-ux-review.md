# Revisione UX/UI pagina Inserimento

## Scope
- Verificare la pagina di inserimento allenamento e migliorarne la UX/UI se necessario.
- Mantenere inalterata la logica del form (validazione, payload, gestione stato).
- Allineare lo stile al nuovo layout con sidebar e al look & feel dashboard.

## Approccio
- Analisi della pagina attuale: struttura del form, gerarchia visiva, leggibilità su desktop/mobile.
- Migliorare spaziature, grouping dei campi e stati di focus/active per una compilazione più chiara.
- Limitare le modifiche al markup e ai CSS del route `/inserimento` senza toccare il comportamento.

## File chiave (previsti)
- `web/src/app/(main)/inserimento/page.tsx` per eventuale riorganizzazione semantica del markup.
- `web/src/app/(main)/inserimento/page.module.css` per aggiornare stili e stato interattivo.

## Implementation
- Riorganizzato il markup della pagina `web/src/app/(main)/inserimento/page.tsx` in tre sezioni (Struttura base, Dettagli esercizio, Carico e sensazioni) per migliorare la leggibilità senza cambiare la logica del form.
- Aggiornati gli stili in `web/src/app/(main)/inserimento/page.module.css`: sfondo più neutro per allinearsi al layout con sidebar, box sezionati, focus state evidenti per chip e input, spaziature ottimizzate su mobile.
- Non sono stati modificati validazione, payload o gestione dello stato del form.
- Check eseguiti: `cd web && npm run lint`.
- Aggiunto pulsante “All” per le serie: se attivo duplica la serie selezionata X volte (X = numero scelto) generando più serie nel payload loggato; senza “All” il numero continua a indicare la singola serie. Success banner ora mostra il conteggio serie create.
- Sidebar resa sticky/fissa: `web/src/app/(main)/_components/Sidebar.module.css`.
