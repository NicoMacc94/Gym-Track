# Storico – tabella, filtri, ricerca e sorting (2025-12-08)

## Scopo
- Mostrare tutti gli inserimenti del flusso “inserimento” in una tabella leggibile con tutte le colonne (scheda, settimana, giorno, data, esercizio, serie, ripetizioni, peso, RPE, note).
- Offrire filtri, ricerca e ordinamento estendibili senza modificare la struttura del payload del form.
- Mantenere uno stile coerente con l’attuale layout dashboard e con i componenti già presenti.

## Assunzioni
- Non esiste ancora persistenza; userò un dataset mock locale che rispetta la struttura del payload del form (stessi campi, stessi tipi). L’implementazione sarà pensata per sostituire facilmente il mock con dati reali.
- Ordinamento predefinito per data decrescente; a parità di data, settimana/giorno mantengono la gerarchia esistente.

## Approccio
- Definire `WorkoutEntry` allineato al payload del form (scheda, settimana, giorno, data, esercizio, serie, ripetizioni, peso?, rpe?, note?).
- Strutturare la logica di filtri/ricerca/ordinamento in funzioni pure e `useMemo`:
  - Ricerca full-text su scheda, esercizio e note.
  - Filtri per scheda (select), settimana e giorno (chip/select), intervallo data (da/a) e RPE minimo/opzionale.
  - Ordinamento per colonna con toggle asc/desc; default su data desc.
- UI/UX:
  - Barra di controllo con search, filtri e reset rapido.
  - Tabella con header stickato, badge per valori opzionali, indicatori di sort.
  - Stato vuoto per quando i filtri non restituiscono risultati.
  - Responsività con overflow controllato orizzontale su mobile e colonne compatte.

## File da toccare
- `web/src/app/(main)/storico/page.tsx`
- `web/src/app/(main)/storico/page.module.css`

## Implementation
- Implementata `web/src/app/(main)/storico/page.tsx` come client component con dataset mock coerente con il payload del form, filtri estendibili (scheda, settimana, giorno, date range, RPE minimo), ricerca full-text, ordinamento per colonna e reset globale; tabella con tutte le colonne richieste e stato vuoto.
- Aggiornato `web/src/app/(main)/storico/page.module.css` con layout dashboard, controlli a griglia, badge/indicatori di sort, tabella scrollabile e responsiva.
- Assunzione confermata: finché manca la persistenza, i dati arrivano da un mock locale; la logica è pronta a sostituire il dataset con una sorgente reale.
- Test eseguiti: `cd web && npm run lint`.
