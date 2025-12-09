import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Benvenuto</p>
        <h1 className={styles.title}>Gestisci i tuoi allenamenti con Gs Palestra</h1>
        <p className={styles.lead}>
          Crea e consulta le sessioni di allenamento in un unico spazio. Accedi
          rapidamente al form di inserimento o allo storico per tenere sotto
          controllo i progressi.
        </p>
        <div className={styles.actions}>
          <Link href="/inserimento" className={styles.primary}>
            Inserisci un allenamento
          </Link>
          <Link href="/storico" className={styles.secondary}>
            Vai allo storico
          </Link>
        </div>
      </section>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h2>Inserimento rapido</h2>
          <p>
            Compila i dettagli delle sessioni con convalide già pronte: scheda,
            settimana/giorno, esercizi, serie, ripetizioni, peso e note.
          </p>
          <Link href="/inserimento" className={styles.link}>
            Apri il form di inserimento
          </Link>
        </div>
        <div className={styles.card}>
          <h2>Storico allenamenti</h2>
          <p>
            Una vista dedicata per consultare i log salvati. In questa fase è
            un placeholder, ma la navigazione è già pronta.
          </p>
          <Link href="/storico" className={styles.link}>
            Vai alla pagina Storico
          </Link>
        </div>
      </div>
    </div>
  );
}
