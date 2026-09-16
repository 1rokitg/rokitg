"use client";
import Link from "next/link";
import type { Course, Lesson } from "@/lib/courses";
import { useCourseProgress } from "./progress";
import styles from "@/app/app/courses/courses.module.scss";

export function LessonReader({ course, lesson }: { course: Course; lesson: Lesson }) {
  const { progress, ready, error, toggle } = useCourseProgress();
  const completed = (progress[course.slug] ?? []).filter((slug) =>
    course.lessons.some((item) => item.slug === slug),
  );
  const index = course.lessons.findIndex((item) => item.slug === lesson.slug);
  const next = course.lessons[index + 1];
  const done = completed.includes(lesson.slug);
  return (
    <>
      <Link href={`/app/courses/${course.slug}`} className={styles.back}>
        ← {course.title}
      </Link>
      <div className={styles.classroom}>
        <aside className={styles.syllabus}>
          <p className={styles.eyebrow}>TU RECORRIDO</p>
          <h2>{course.title}</h2>
          <progress
            aria-label="Progreso del curso de muestra"
            value={completed.length}
            max={course.lessons.length}
          />
          <p className={styles.muted}>
            {ready
              ? `${completed.length} de ${course.lessons.length} completadas`
              : "Cargando progreso…"}
          </p>
          <nav aria-label="Lecciones">
            {course.lessons.map((item, i) => (
              <Link
                key={item.slug}
                aria-current={item.slug === lesson.slug ? "page" : undefined}
                href={`/app/courses/${course.slug}/${item.slug}`}
              >
                <span>{completed.includes(item.slug) ? "✓" : String(i + 1).padStart(2, "0")}</span>
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <article className={styles.reader}>
          <p className={styles.eyebrow}>
            LECCIÓN {index + 1} / {course.lessons.length} · {lesson.minutes} MIN DE LECTURA ·
            MUESTRA
          </p>
          <h1>{lesson.title}</h1>
          {lesson.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <section className={styles.exercise}>
            <p className={styles.eyebrow}>AHORA TE TOCA A TI</p>
            <h2>Ponlo en práctica</h2>
            <p>{lesson.exercise}</p>
          </section>
          <button
            className={styles.button}
            disabled={!ready}
            aria-pressed={done}
            onClick={() => toggle(course.slug, lesson.slug)}
          >
            {done ? "✓ Completada · Desmarcar" : "Marcar como completada"}
          </button>
          <p role="status" className={styles.muted}>
            {error || "El progreso de la muestra se guarda en este navegador."}
          </p>
          <div className={styles.readerNav}>
            {index > 0 && (
              <Link href={`/app/courses/${course.slug}/${course.lessons[index - 1].slug}`}>
                ← Anterior
              </Link>
            )}
            <Link href={next ? `/app/courses/${course.slug}/${next.slug}` : "/app/courses/library"}>
              {next ? "Siguiente lección →" : "Ver mi aprendizaje →"}
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
