import type { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";
import styles from "./layout.module.css";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.mainInner}>{children}</div>
      </main>
    </div>
  );
}
