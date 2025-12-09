# TODO-DB – Audit e logging avanzato

## Scope (da fare)
- Introdurre audit trail per modifiche a piani, esercizi, week entries e workout logs (chi, cosa, quando).
- Valutare logging centralizzato per le API (livelli, retention, alert).
- Considerare soft delete generalizzata con `deleted_at` dove serve.

## Perché è rimandato
- Prima versione richiede solo campi `created_at`/`updated_at` e soft delete base; nessun audit avanzato.
- Logging avanzato e auditing saranno valutati dopo la stabilizzazione delle API.

## Note/Prerequisiti
- Definire policy di retention e formato log (JSON strutturato).
- Se serve, introdurre una tabella audit dedicata o strumenti esterni (es. Logflare/Datadog).

## Quando implementato
- Aggiornare questo file rimuovendo “TODO” dal nome e descrivendo schema/policy di audit e logging adottate.
