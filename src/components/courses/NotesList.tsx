"use client";
import Link from "next/link";
import type { Course } from "@/lib/courses";
import { useNotes } from "./notes";
import styles from "@/app/(academy)/app/courses/courses.module.scss";

export function NotesList({ courses }: { courses: Course[] }) {
  const { notes, ready } = useNotes();
  const entries = courses.flatMap((course) =>
    course.lessons
      .map((lesson) => ({ course, lesson, text: notes[`${course.slug}/${lesson.slug}`] }))
      .filter((entry): entry is typeof entry & { text: string } => !!entry.text),
  );
  return (
    <div className={styles.shell} lang="es">
      <section className={styles.catalog}>
        <p className={styles.eyebrow}>LO QUE HAS APUNTADO</p>
        <h1>Notas</h1>
        <p className={styles.lead}>Tus apuntes por lección, guardados en este navegador.</p>
        {!ready ? (
          <p role="status">Cargando…</p>
        ) : entries.length ? (
          <div className={styles.grid}>
            {entries.map(({ course, lesson, text }) => (
              <Link
                key={`${course.slug}/${lesson.slug}`}
                className={styles.purchase}
                href={`/app/courses/${course.slug}/${lesson.slug}`}
              >
                <span className={styles.badge}>{course.title}</span>
                <h2>{lesson.title}</h2>
                <p>{text.length > 140 ? `${text.slice(0, 140)}…` : text}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              ↗
            </span>
            <h2>Todavía no tienes notas</h2>
            <p>Abre una lección y escribe algo en "Tus notas" para verlo aquí.</p>
            <Link className={styles.button} href="/app/courses">
              Explorar cursos →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
