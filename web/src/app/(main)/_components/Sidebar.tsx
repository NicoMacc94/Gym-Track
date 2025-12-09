"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/inserimento", label: "Inserimento" },
  { href: "/aggiornamento", label: "Aggiornamento" },
  { href: "/storico", label: "Storico" },
];

const isActive = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function Sidebar() {
  const pathname = usePathname() || "/";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandMark}>Gs</div>
        <div className={styles.brandCopy}>
          <p className={styles.brandTitle}>Gs Palestra</p>
          <p className={styles.brandSubtitle}>Allenamenti e progressi</p>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Navigazione principale">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${active ? styles.active : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className={styles.dot} aria-hidden />
              <span className={styles.linkLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <p className={styles.footer}>
        Passa rapidamente tra home, inserimento, aggiornamento e storico mentre lavori
        ai tuoi allenamenti.
      </p>
    </aside>
  );
}
