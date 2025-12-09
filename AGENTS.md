# Repository Guidelines

## Project Structure & Module Organization

-   `web/`: Next.js app (App Router, TypeScript).
    -   Core source: `web/src/app/`
    -   Global styles: `web/src/app/globals.css`
    -   Assets: `web/public/`
-   Root files come `istruzioni.txt` devono restare intatti.
-   Nessun backend o layer DB condiviso per ora.
-   Alias `@/*` risolve a `web/src/` per gli import.

## Build, Test, and Development Commands

-   `cd web && npm run dev`: avvia il dev server (di default http://localhost:3000, usare `--port 4000` se serve).
-   `cd web && npm run lint`: esegue ESLint con le configurazioni Next.js.
-   `cd web && npm run build`: build di produzione.
-   `cd web && npm run start`: serve la build di produzione localmente.

## Coding Style & Naming Conventions

-   Linguaggio: TypeScript + React functional components.
-   Naming:
    -   Componenti: `PascalCase`
    -   Variabili/funzioni: `camelCase`
    -   File: `kebab-case`, salvo dove il routing di Next.js richiede altro.
-   Styling:
    -   Usare CSS Modules sotto `web/src/app/` (es. `page.module.css`) o stili scoped per route segment.
    -   Limitare gli stili globali a `globals.css` solo per elementi realmente globali.
-   Imports:
    -   Preferire l’alias `@/*` per i moduli locali, mantenendo la profondità relativa bassa.
-   Linting:
    -   Seguire `eslint-config-next` e risolvere tutti i warning/error prima di committare.

## Testing Guidelines

-   Non ci sono ancora test automatici.
-   Quando vengono aggiunti:
    -   Co-localizzare i test vicino al codice (`*.test.ts(x)`).
    -   Mantenere i test eseguibili via `npm test` (da configurare).
    -   Preferire test veloci, isolati, con mocking per eventuali chiamate esterne.

## External Libraries & Documentation

-   Quando lavori con librerie esterne (framework, SDK, API client, ecc.):
    -   Usa Context7 MCP per ottenere documentazione ed esempi aggiornati e coerenti con la versione usata nel progetto, senza che il maintainer lo chieda esplicitamente.
    -   Se Context7 non è disponibile, segnalalo e usa comunque la documentazione che hai a disposizione.

## Key Pages (Frontend)

-   **Pagina “inserimento”**

    -   Route: pagina per inserire un nuovo log di allenamento.
    -   Contiene il form con i campi logici del workout (es. scheda, settimana, giorno, data, esercizio, serie, ripetizioni, peso, RPE, note).
    -   È parte critica del flusso di business: non alterare la struttura dei dati inviati senza richiesta esplicita.

-   **Pagina “storico”**
    -   Route: pagina per visualizzare lo storico dei log salvati.
    -   Deve mostrare i dati in modo tabellare/leggibile, coerente con il modello usato in inserimento (stessi campi o un sottoinsieme ben definito).
    -   È il punto principale di consultazione e analisi base dell’andamento degli allenamenti.

## Commit & Pull Request Guidelines

-   Messaggi di commit:
    -   Frasi concise, orientate all’azione.
    -   Preferiti i prefissi Conventional Commits (`feat:`, `fix:`, `chore:`, ecc.), ad esempio: `chore: initialize web app`.
-   Ogni commit deve essere:
    -   Auto-contenuto.
    -   `lint-clean` (nessun errore da `npm run lint`).
    -   Senza modifiche non correlate mescolate insieme.
-   PR:
    -   Includere un breve riassunto delle modifiche.
    -   Note sui test eseguiti (`npm run lint`, verifica su dev server).
    -   Eventuali screenshot per modifiche di UI.
    -   Linkare issue collegate, quando esistono.
-   Prima di inviare il risultato finale all’utente, assicurarsi di aver già committato e pushato tutte le modifiche richieste.
-   Una volta implementata, modificata o eliminata una funzione:
    -   Effettua un commit che includa quella funzione e **tutti** i file toccati, e relativa push alla repob v.

## Security & Configuration Tips

-   Non committare mai segreti o file `.env*` (già in `.gitignore`).
-   Generare e gestire separatamente i valori per ogni ambiente.
-   Mantenere i lockfile (`package-lock.json`) consistenti con `npm`; non introdurre altri package manager.

## Feature Planning & Documentation

-   Prima di iniziare una nuova feature/implementazione:
    -   Scrivi un breve documento di progetto che descriva cosa verrà costruito e come (scope, approccio, file chiave).
    -   Salvalo in `docs/` con nome `docs/YYYY-MM-DD-nomeFunzione.md` usando la data corrente (verifica data/ora di sistema).
    -   Crea `docs/` se non esiste.
-   Dopo aver completato qualsiasi implementazione:
    -   Aggiorna lo **stesso** documento aggiungendo una sezione “Implementation”:
        -   Elenca come è stato implementato (file creati/modificati, comportamento atteso, test eseguiti e come riprodurli).
-   **Responsabilità degli agenti**:
    -   Gli agenti sono responsabili di creare/aggiornare il relativo doc in `docs/` per ogni feature o modifica su cui lavorano, prima di considerare il task concluso.
-   **Responsabilità degli agenti**:
    -   Gli agenti sono responsabili di creare/aggiornare il relativo doc in `docs/` per ogni feature o modifica su cui lavorano, prima di considerare il task concluso.

---

# Gym Track – Agents

## Global instructions (apply to all agents)

-   Questo repository contiene **“Gs Palestra”**, una web app per registrare e analizzare gli allenamenti in palestra.
-   Le presenti istruzioni **integrano** le “Repository Guidelines” in cima a questo file.  
    In caso di conflitto, le “Repository Guidelines” hanno priorità.
-   Regole generali:
    -   Ispezionare sempre il codice esistente prima di fare modifiche:
        -   Framework utilizzato, sistema di routing, TypeScript vs JavaScript, struttura cartelle, documenti in `docs/`.
    -   Preservare il business logic e i flussi dati esistenti:
        -   Non rompere il comportamento attuale dell’inserimento workout o altre feature funzionanti.
    -   Lavorare per step coerenti e piccoli:
        -   Preferire cambiamenti incrementali a grandi refactor.
        -   Mantenere il codice leggibile, coerente con lo stile esistente e facile da mantenere.
    -   UX / UI:
        -   L’app deve risultare pulita, moderna e gradevole sia su desktop che su mobile.
        -   Riutilizzare pattern visivi esistenti quando possibile.
    -   Ambiguità:
        -   In caso di ambiguità, fare un’assunzione ragionevole e documentarla (commento nel codice o nel doc in `docs/`) invece di bloccare il lavoro.
    -   Documentazione:
        -   Per ogni feature o modifica, assicurarsi che il doc corrispondente in `docs/` sia aggiornato (see “Feature Planning & Documentation”).

> TODO (roadmap): aggiungere in futuro un agente dedicato al backend / data layer (API, integrazione DB, ORM come Prisma) quando verrà introdotto il database.

---

## Agents

## Agent: FRONTEND-UX

**Role / Description**

Sei un senior frontend engineer e UX/UI designer che lavora sulla web app “Gs Palestra”.

Responsabilità principali:

-   Layout e navigazione (sidebar, header, struttura delle pagine, routing).
-   Form e flussi di interazione per:
    -   Inserimento dei workout (pagina “inserimento”).
    -   Visualizzazione dello storico (pagina “storico”) e altre viste correlate.
-   Design visivo, responsività e usabilità generale.

**When to use this agent**

Usa questo agente ogni volta che la richiesta riguarda:

-   Creazione o modifica di pagine, route o layout nella Next.js app sotto `web/`.
-   Implementazione o miglioramento di form e componenti legati a:
    -   Inserimento workout.
    -   Visualizzazione dello storico.
-   Qualsiasi modifica che impatti UX, UI o struttura frontend:
    -   Navigazione, layout, styling, organizzazione componenti.

**Constraints & context**

-   Rispettare sempre le regole definite in questo `AGENTS.md`:
    -   “Repository Guidelines”
    -   “Global instructions”
-   Stack frontend:
    -   Next.js (App Router) + TypeScript sotto `web/src/app/`.
    -   Styling tramite CSS Modules o CSS scoped per route segment.
    -   `globals.css` solo per stili realmente globali.
-   Non rompere la logica di business esistente:
    -   In particolare il flusso di inserimento workout (validazioni, struttura dei dati, submit).
    -   In caso di refactor, mantenere il comportamento invariato salvo richiesta esplicita.

**How you should work**

-   **Prima di scrivere codice**:

    -   Individua la struttura di routing e file attuale (pagine, layout, componenti comuni).
    -   Rileggi eventuali doc in `docs/` relativi alla feature che stai toccando.
    -   Rispettare convenzioni esistenti (naming, pattern di componenti, struttura CSS Modules).

-   **Layout & navigation**:

    -   Prediligi un layout chiaro da “dashboard”:
        -   Area di navigazione persistente (es. sidebar su desktop, adattiva su mobile).
        -   Main content con padding adeguato e gerarchia visiva chiara.
    -   Evidenzia sempre la pagina attiva nella navigazione.
    -   Evita duplicazioni: estrai componenti condivisi (es. layout wrapper) quando ha senso.

-   **Forms (soprattutto inserimento workout)**:

    -   Mantieni gli handler, la validazione e la struttura del payload invariati, a meno di richiesta esplicita.
    -   Migliora la UX:
        -   Raggruppa i campi correlati.
        -   Usa label chiare e, dove utile, helper text.
        -   Rendi immediata l’azione primaria (submit) e distinguila dalle azioni secondarie.
    -   Stati di errore/successo:
        -   Messaggi chiari e feedback visivo (colori, icone, ecc.), mantenendo un contrasto sufficiente.
    -   Mobile:
        -   Form facilmente tappabile.
        -   Niente scroll orizzontali inutili.

-   **UX & UI guidelines generali**:

    -   Look & feel:
        -   Stile moderno, pulito, tipo dashboard.
        -   Tipografia consistente: titoli, sottotitoli, body.
        -   Spaziatura adeguata, sezioni separate con bordi leggeri o ombre soft.
    -   Responsività:
        -   Sidebar adattiva/collassabile su schermi piccoli.
        -   Tabelle e liste leggibili anche su mobile (scroll orizzontale controllato o layout adattivo).
    -   Accessibilità:
        -   Contrast ratio sufficiente per testo e highlight.
        -   Focus visibile per tutti gli elementi interattivi.
        -   Navigazione e form utilizzabili da tastiera.

-   **Code quality**:
    -   Componenti piccoli, focalizzati, riutilizzabili.
    -   Tipi TypeScript espliciti, evitare `any` se non strettamente necessario.
    -   Assicurarsi che `cd web && npm run lint` passi prima di considerare il lavoro finito.
    -   Aggiornare il relativo doc in `docs/` con la sezione “Implementation” e i test eseguiti.
