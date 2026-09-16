"use client";
import Link from "next/link";
import type { Course } from "@/lib/courses";
import { useCourseProgress } from "./progress";
import styles from "@/app/app/courses/courses.module.scss";

export function CourseLibrary({ courses }: { courses: Course[] }) {
  const { progress, ready } = useCourseProgress();
  const started = courses.filter((course) =>
    course.lessons.some((lesson) => progress[course.slug]?.includes(lesson.slug)),
  );
  return (
    <section className={styles.catalog}>
      <p className={styles.eyebrow}>UN PASO CADA VEZ</p>
      <h1>Mi aprendizaje</h1>
      <p className={styles.lead}>Retoma las lecciones de muestra que has empezado.</p>
      <p className={styles.notice}>
        Este progreso se guarda solo en este navegador. La biblioteca de compras estará disponible
        al abrir las inscripciones.
      </p>
      {!ready ? (
        <p role="status">Cargando progreso…</p>
      ) : started.length ? (
        <div className={styles.grid}>
          {started.map((course) => {
            const completed = course.lessons.filter((lesson) =>
              progress[course.slug]?.includes(lesson.slug),
            );
            const next =
              course.lessons.find((lesson) => !completed.includes(lesson)) ?? course.lessons[0];
            return (
              <article key={course.slug} className={styles.purchase}>
                <span className={styles.badge}>Curso de muestra</span>
                <h2>{course.title}</h2>
                <progress
                  aria-label={`Progreso: ${course.title}`}
                  value={completed.length}
                  max={course.lessons.length}
                />
                <p>
                  {completed.length} de {course.lessons.length} lecciones completadas
                </p>
                <Link className={styles.button} href={`/app/courses/${course.slug}/${next.slug}`}>
                  {completed.length === course.lessons.length
                    ? "Repasar curso"
                    : "Continuar aprendiendo"}{" "}
                  →
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">
            ↗
          </span>
          <h2>Tu próxima lección te espera</h2>
          <p>Completa una lección de muestra y aparecerá aquí para que puedas continuar.</p>
          <Link className={styles.button} href="/app/courses">
            Explorar cursos →
          </Link>
        </div>
      )}
    </section>
  );
}
