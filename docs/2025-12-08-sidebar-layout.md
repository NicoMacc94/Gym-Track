# Sidebar layout e pagine principali

## Scope
- Layout condiviso con sidebar di navigazione per le pagine principali.
- Pagine: Home (/), Inserimento (/inserimento), Storico (/storico).
- Spostare l’attuale form di inserimento allenamento nel nuovo percorso /inserimento mantenendo la logica invariata.

## Approccio
- Creare un layout condiviso nell’App Router con sidebar a sinistra (desktop) e contenuto principale a destra; gestione stato attivo in base al percorso.
- Riutilizzare il form esistente spostandolo nella route /inserimento senza modifiche funzionali (validazione, shape payload, comportamenti).
- Home: messaggio di benvenuto con link rapidi alle altre pagine; Storico: placeholder informativo.
- Styling tramite CSS Modules/route-scoped, con attenzione alla responsività (sidebar comprimibile o impilata su schermi piccoli).

## File chiave (previsti)
- `web/src/app/(main)/layout.tsx` + CSS associato per struttura layout e sidebar condivisa.
- `web/src/app/(main)/_components/Sidebar.tsx` (+ CSS) per la navigazione con stato attivo.
- `web/src/app/(main)/page.tsx` per Home aggiornata.
- `web/src/app/(main)/inserimento/page.tsx` (riuso del form esistente e relativi stili).
- `web/src/app/(main)/storico/page.tsx` per placeholder storico.
- Aggiornamenti a eventuali CSS Modules esistenti per adattare i nuovi percorsi.

## Implementation
- Creata route group `(main)` con layout condiviso e sidebar: `web/src/app/(main)/layout.tsx`, `layout.module.css`, `_components/Sidebar.tsx` e relativo CSS.
- Home spostata in `web/src/app/(main)/page.tsx` con contenuti di benvenuto e link rapidi; styling in `web/src/app/(main)/page.module.css`.
- Form di inserimento spostato (logica invariata) in `web/src/app/(main)/inserimento/page.tsx` con il CSS originale; rimossa la vecchia route `/allenamenti/nuovo`.
- Aggiunta pagina placeholder `web/src/app/(main)/storico/page.tsx` con stile dedicato per il titolo/descrizione.
- Aggiornato il metadata principale in `web/src/app/layout.tsx` per riflettere “Gs Palestra”.
- Check eseguiti: `cd web && npm run lint`.
