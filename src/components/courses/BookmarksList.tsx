"use client";
import Link from "next/link";
import type { Course } from "@/lib/courses";
import { useBookmarks } from "./bookmarks";
import styles from "@/app/(academy)/app/courses/courses.module.scss";

export function BookmarksList({ courses }: { courses: Course[] }) {
  const { bookmarks, ready } = useBookmarks();
  const saved = courses.flatMap((course) =>
    (bookmarks[course.slug] ?? [])
      .map((slug) => course.lessons.find((lesson) => lesson.slug === slug))
      .filter((lesson): lesson is Course["lessons"][number] => !!lesson)
      .map((lesson) => ({ course, lesson })),
  );
  return (
    <div className={styles.shell} lang="es">
      <section className={styles.catalog}>
        <p className={styles.eyebrow}>PARA MÁS TARDE</p>
        <h1>Guardados</h1>
        <p className={styles.lead}>Las lecciones que has marcado para volver a ellas.</p>
        {!ready ? (
          <p role="status">Cargando…</p>
        ) : saved.length ? (
          <div className={styles.grid}>
            {saved.map(({ course, lesson }) => (
              <Link
                key={`${course.slug}/${lesson.slug}`}
                className={styles.purchase}
                href={`/app/courses/${course.slug}/${lesson.slug}`}
              >
                <span className={styles.badge}>{course.title}</span>
                <h2>{lesson.title}</h2>
                <p>{lesson.minutes} min de lectura</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              ↗
            </span>
            <h2>Nada guardado todavía</h2>
            <p>Abre una lección y pulsa el icono de guardar para verla aquí.</p>
            <Link className={styles.button} href="/app/courses">
              Explorar cursos →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
