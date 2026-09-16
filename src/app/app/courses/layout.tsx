import Link from "next/link";
import styles from "./courses.module.scss";

export const metadata = {
  title: "Cursos | RokitG",
  description: "Aprende, practica y sigue tu progreso en el aula de RokitG.",
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell} lang="es">
      <header className={styles.header}>
        <Link href="/app/courses" className={styles.brand}>
          R<span>↗</span>{" "}
          <span>
            ROKITG <small>ACADEMY</small>
          </span>
        </Link>
        <nav aria-label="Aula">
          <Link href="/app/courses">Explorar cursos</Link>
          <Link href="/app/courses/library">Mi aprendizaje</Link>
        </nav>
        <span className={styles.badge}>Vista previa</span>
      </header>
      {children}
      <footer className={styles.footer}>
        Aprende a tu ritmo. Ponlo en práctica. <span>RokitG Academy · Versión inicial</span>
      </footer>
    </div>
  );
}
