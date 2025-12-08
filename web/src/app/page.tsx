import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Gym Track</h1>
          <p className={styles.subtitle}>
            Monitora i tuoi allenamenti e progressi in un unico posto, con una
            panoramica chiara delle tue sessioni.
          </p>
        </header>

        <section className={styles.placeholder}>
          <h2>Allenamenti</h2>
          <p>Qui in futuro vedrai i tuoi allenamenti.</p>
        </section>
      </main>
    </div>
  );
}
