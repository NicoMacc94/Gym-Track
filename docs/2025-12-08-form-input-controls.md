# Aggiornamento controlli form allenamento

## Scopo
- Rendere più guidata la compilazione del form di inserimento allenamento con gruppi di pulsanti/slider e vincoli chiari.
- Aggiungere un accesso rapido dalla home alla pagina di nuovo allenamento.

## Cosa cambierà
- Sostituire gli input numerici di Settimana e Giorno con gruppi di 7 pulsanti (1–7) a selezione esclusiva e obbligatoria (uno e uno solo attivo).
- Sostituire Serie con un gruppo di pulsanti 1–5 a scelta esclusiva e obbligatoria.
- Peso: vincolo minimo 0 sia a livello di attributo HTML sia in validazione JS (nessun valore negativo accettato).
- RPE: rimpiazzare l’input con 5 pulsanti (1–5); campo opzionale ma, se valorizzato, deve essere uno dei 5 valori.
- Data: precompilata all’apertura con la data odierna (formato `YYYY-MM-DD`).
- Ripetizioni: input numerico intero 1–50 (ripristinato).
- Peso: slider `range` con minimo 0 (nessun negativo), validazione coerente.
- Home: aggiungere un CTA evidente che porta a `/allenamenti/nuovo` per raggiungere subito il form.

## Approccio
- Aggiornare lo state del form per gestire i nuovi controlli (valori stringa/number coerenti con i pulsanti e lo slider) e reset consistente.
- Creare componenti UI locali (p.es. piccoli gruppi di pulsanti) con classi in `page.module.css` per gestire stato attivo/errore/accessibilità (`role="radiogroup"`, `aria-pressed`, ecc.).
- Adeguare la validazione: Settimana/Giorno obbligatori 1–7; Serie obbligatorio 1–5; Peso >= 0; RPE opzionale 1–5; Ripetizioni intere 1–50.
- In `useEffect` o inizializzazione, impostare il valore di Data a oggi e assicurare che reset ripristini anche questo default.
- Aggiornare gli hint/testi per riflettere i nuovi controlli e vincoli.
- Home: inserire un pulsante/CTA stilizzato che linka a `/allenamenti/nuovo`, mantenendo il look esistente e adattando il CSS se necessario.

## File toccati
- `web/src/app/allenamenti/nuovo/page.tsx` per logica, controlli e validazione.
- `web/src/app/allenamenti/nuovo/page.module.css` per gli stili dei gruppi di pulsanti/slider.
- `web/src/app/page.tsx` e relativo `page.module.css` per il CTA verso `/allenamenti/nuovo`.

## Extra note
- Nessuna dipendenza esterna prevista.
- Dopo implementazione, documentare la sezione “Implementation” in questo file con dettagli su modifiche, comportamenti attesi e verifiche manuali eseguite.

## Implementation
- Form aggiornato in `web/src/app/allenamenti/nuovo/page.tsx`: Settimana e Giorno ora sono gruppi di 7 pulsanti (1–7) a selezione esclusiva e obbligatoria; Serie è un gruppo di 5 pulsanti (1–5) obbligatorio; RPE è un gruppo di 5 pulsanti opzionale con toggle per deselezionare. Peso passa a slider 0–300 kg step 0.25 con validazione min 0 (nessun negativo). Ripetizioni tornano a input numerico intero richiesto 1–50. Data viene precompilata all’apertura/reset con la data odierna locale (`YYYY-MM-DD`). Reset e submit riportano lo stato iniziale coerente.
- Stili in `web/src/app/allenamenti/nuovo/page.module.css`: aggiunte classi per i gruppi di pulsanti (chip, stato attivo, hover) e per lo slider/valore mostrato (usato per Peso).
- CTA in home: `web/src/app/page.tsx` + `page.module.css` ora includono un pulsante “Nuovo allenamento” che porta a `/allenamenti/nuovo`, con testo di supporto.

### Comportamento atteso
- Non si può inviare il form senza scegliere Settimana, Giorno e Serie (1–7, 1–7, 1–5). RPE è opzionale, ma se selezionato è 1–5. Peso slider 0–300 kg step 0.25 non accetta valori negativi. Ripetizioni richiede un intero 1–50. La Data è valorizzata di default al giorno corrente.
- Cliccare sul valore attivo dell’RPE lo deseleziona (per mantenerlo opzionale). Reset ripristina il default, inclusa la data odierna e lo slider del Peso a 0.
- Dalla home è possibile arrivare direttamente al form tramite il CTA.

### Verifiche eseguite
- `cd web && npm run lint`
- Check manuale rapido: apertura pagina “Nuovo allenamento” con data precompilata; interazione con i gruppi di pulsanti (selezione esclusiva); slider Peso mostra il valore; CTA in home porta a `/allenamenti/nuovo`.
