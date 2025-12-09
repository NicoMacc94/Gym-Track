# TODO-DB – Connessioni e pooling (Vercel/Prisma)

## Scope (da fare)
- Valutare e, se necessario, attivare Prisma Data Proxy o soluzioni di pooling per deploy su Vercel.
- Configurare limiti di connessioni e timeouts per evitare saturazione del DB in ambienti serverless.

## Perché è rimandato
- Prima versione solo locale; non è richiesto pooling avanzato.
- La necessità dipende dal provider di produzione e dai limiti di connessioni.

## Note/Prerequisiti
- Se si usa PlanetScale, valutare Data Proxy o connessioni prisma ottimizzate.
- Testare tempi di cold start e latenza con/ senza proxy.
- Aggiornare env vars per il proxy se adottato.

## Quando implementato
- Aggiornare questo file rimuovendo “TODO” dal nome e documentando configurazione scelta (proxy sì/no, settaggi pooling).
