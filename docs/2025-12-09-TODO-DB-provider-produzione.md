# TODO-DB – Scelta provider di produzione

## Scope (da fare)
- Selezionare e configurare il provider MySQL di produzione (es. PlanetScale, Railway, RDS, altro).
- Definire parametri di connessione sicuri (host, porta, user, password, SSL) e politiche di backup del provider.
- Adattare eventuali limiti o specificità del provider (pooling, piani free/paid, restrizioni DDL).

## Perché è rimandato
- Prima fase solo in locale/dev senza SSL obbligatorio.
- La scelta del provider dipende da costi e requisiti operativi non ancora definiti.

## Note/Prerequisiti
- Verificare compatibilità con Prisma (migrate/data proxy) e Vercel.
- Se il provider richiede SSL, aggiornare la config Prisma e le variabili d’ambiente.
- Valutare limiti di connessioni simultanee per l’uso su Vercel.

## Quando implementato
- Aggiornare questo file rimuovendo “TODO” dal nome e descrivendo provider scelto, parametri di connessione, policy di backup/SSL.
