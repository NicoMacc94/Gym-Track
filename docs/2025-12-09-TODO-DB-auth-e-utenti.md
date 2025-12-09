# TODO-DB – Auth e gestione utenti

## Scope (da fare)
- Integrare autenticazione multi-utente con NextAuth (provider GitHub e Google nella prima versione).
- Gestire `user_id` su piani, giorni, esercizi, week entries e workout logs con ACL di appartenenza.
- Profilo utente minimo (id esterno, email, nome visualizzato) per collegare i dati della web app agli account provider.

## Perché è rimandato
- Prima iterazione: schema DB e API senza login attivo; focus su funzionalità core.
- Auth e provider verranno collegati in una fase successiva per ridurre complessità iniziale.

## Note/Prerequisiti
- Aggiornare le API per validare `user_id` dopo l’introduzione di NextAuth.
- Decidere la strategia di sessione su Vercel (NextAuth JWT) e secure cookie settings.
- Prevedere eventuale tabella `users` o mapping id esterno → id interno se richiesto dai provider.

## Quando implementato
- Aggiornare questo file rimuovendo “TODO” dal nome e descrivendo lo stato finale (provider attivi, schema aggiornato, middleware auth).
