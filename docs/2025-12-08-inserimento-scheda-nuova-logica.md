# Nuova logica pagina Inserimento (scheda allenamento)

## Scope
- Reimpostare /inserimento per creare una nuova scheda di allenamento, non singolo log.
- Gestire form generale con nome scheda, numero settimane (1-6) e numero giorni (1-7).
- Introdurre card giornaliere dinamiche con esercizi multipli per giorno, aggiunta/rimozione/riordino.

## Approccio
- Definire stato tipizzato per scheda, giorni e esercizi preservando i dati già inseriti quando si aggiungono giorni.
- Collegare il form principale (numero giorni/settimane) alla generazione/aggiornamento delle card giorno, aggiungendo nuove card in coda.
- Implementare controlli di riordino giorno mantenendo intatti i contenuti; la riduzione dei giorni avviene dal selettore principale.
- Fornire UI chiara per aggiungere esercizi per ogni giorno, con un esercizio iniziale precompilato per ogni nuova card.
- Alleggerire/semplificare la pagina rimuovendo i campi non pertinenti alla nuova logica (peso, RPE, ecc.).

## File chiave (previsti)
- `web/src/app/(main)/inserimento/page.tsx` per logica e markup dei form.
- `web/src/app/(main)/inserimento/page.module.css` per lo styling delle card e dei controlli.

## Implementation
- Implementata nuova UI per la creazione di una scheda: form generale con nome scheda obbligatorio, numero settimane (chip 1–6) e numero giorni (chip 1–7) che genera/aggiorna le card giorno in coda, preservando i contenuti esistenti quando il numero cresce.
- Gestione giorni solo via selettore 1–7: le “cartelle giorno” vengono create/limitate da lì, senza pulsante “Aggiungi giorno” separato.
- Visualizzazione a cartelle: selettore Giorno 1..N (tablist) che mostra una sola cartella per volta; gli esercizi che inserisci per un giorno restano isolati e vengono ripristinati quando torni su quella cartella.
- Card giorno dinamiche con riordino (su/giù) che mantiene intatti i dati delle cartelle e aggiorna la posizione/numero del giorno. Eliminazione del giorno avviene solo riducendo il numero di giorni dal selettore.
- Id deterministici per giorni/esercizi (counter in-page) per evitare mismatch di hydration dovuti a UUID random tra server e client.
- Ogni cartella parte con un esercizio di default e consente di aggiungerne altri: campi per nome, serie e ripetizioni, con pulsante per rimuovere gli esercizi aggiuntivi senza toccare gli altri.
- Rimossa la logica legacy del singolo log (peso, RPE, data, ecc.) per concentrarsi sulla definizione della scheda; submit ora logga in console la struttura della scheda e mostra un messaggio di successo locale.
- Styling aggiornato in `web/src/app/(main)/inserimento/page.module.css` per la view a cartelle, i controlli di riordino e la griglia responsiva degli esercizi.
- File modificati: `web/src/app/(main)/inserimento/page.tsx`, `web/src/app/(main)/inserimento/page.module.css`.
- Test eseguiti: `cd web && npm run lint`.
