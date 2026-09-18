"use client";

import Link from "next/link";
import { useCourseProgress } from "@/components/courses/progress";
import { recordVisitAndGetStreak } from "@/lib/academy-progress";
import { formatCoursePrice, type CourseSummary } from "@/lib/course-catalog";
import courseStyles from "@/app/(academy)/app/courses/courses.module.scss";
import styles from "./AcademyHome.module.scss";
import { useEffect, useState } from "react";

export function AcademyHome({ courses }: { courses: CourseSummary[] }) {
  const { progress, ready } = useCourseProgress();
  const [streakDays, setStreakDays] = useState<number | null>(null);

  useEffect(() => {
    setStreakDays(recordVisitAndGetStreak().days);
  }, []);

  const totalLessons = courses.reduce((sum, course) => sum + course.lessonCount, 0);
  const completedLessons = Object.values(progress).reduce((sum, lessons) => sum + lessons.length, 0);
  const startedSlugs = new Set(Object.entries(progress).filter(([, lessons]) => lessons.length > 0).map(([slug]) => slug));

  const continueCourse = courses.find(
    (course) => startedSlugs.has(course.slug) && (progress[course.slug]?.length ?? 0) < course.lessonCount,
  );
  const firstDemoCourse = courses.find((course) => course.status === "demo");

  return (
    <div className={courseStyles.shell} lang="es">
      <section className={courseStyles.hero}>
        <div>
          <p className={courseStyles.eyebrow}>TU PANEL</p>
          <h1>
            Bienvenido de nuevo.
            <br />
            <em>Sigue donde lo dejaste.</em>
          </h1>
          <p className={courseStyles.lead}>
            Un resumen rápido de tu progreso, tu racha y lo próximo que puedes aprender en RokitG Academy.
          </p>
          {ready && (continueCourse ?? firstDemoCourse) && (
            <Link
              className={courseStyles.button}
              href={
                continueCourse
                  ? `/app/courses/${continueCourse.slug}`
                  : `/app/courses/${firstDemoCourse!.slug}`
              }
            >
              {continueCourse ? "Continuar aprendiendo" : "Empieza tu primera lección"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
        <div className={courseStyles.heroArt} aria-hidden="true">
          <span className={courseStyles.orbit}>R</span>
          <div>
            <small>APRENDE → PRACTICA → AVANZA</small>
            <strong>
              {streakDays !== null && streakDays > 0
                ? `${streakDays} ${streakDays === 1 ? "día seguido" : "días seguidos"}.`
                : "Empieza hoy tu racha."}
            </strong>
          </div>
        </div>
      </section>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{streakDays ?? 0}</span>
          <span className={styles.statLabel}>Racha actual (días)</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>
            {completedLessons}/{totalLessons}
          </span>
          <span className={styles.statLabel}>Lecciones completadas</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{courses.length}</span>
          <span className={styles.statLabel}>Cursos disponibles</span>
        </div>
      </div>

      <section className={courseStyles.catalog}>
        <p className={courseStyles.eyebrow}>ELIGE TU CAMINO</p>
        <h2>Explora los cursos</h2>
        <div className={courseStyles.grid}>
          {courses.map((course, index) => (
            <Link className={courseStyles.card} key={course.slug} href={`/app/courses/${course.slug}`}>
              <div className={`${courseStyles.cover} ${index % 2 ? courseStyles.blue : ""}`}>
                <span>{course.category.toUpperCase()}</span>
                <strong aria-hidden="true">{course.category === "Método" ? "↗" : "{ }"}</strong>
                <small>ROKITG / ACADEMY</small>
              </div>
              <div className={courseStyles.cardBody}>
                <p className={courseStyles.eyebrow}>
                  {course.level} · {course.status === "demo" ? "Curso de muestra" : "Próximamente"}
                </p>
                <h3>{course.title}</h3>
                <p>{course.subtitle}</p>
                <div className={courseStyles.cardFoot}>
                  <span>
                    {course.plannedPrice
                      ? `Precio previsto: ${formatCoursePrice(course.plannedPrice)}`
                      : course.lessonCount
                        ? `${course.lessonCount} lecciones · ${course.durationMinutes} min`
                        : "Temario en preparación"}
                  </span>
                  <strong>{course.status === "demo" ? "Probar →" : "Ver detalles →"}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
