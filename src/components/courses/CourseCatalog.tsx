"use client";
import Link from "next/link";
import { useState } from "react";
import { formatCoursePrice, type CourseSummary } from "@/lib/course-catalog";
import styles from "@/app/(academy)/app/courses/courses.module.scss";

export function CourseCatalog({ courses }: { courses: CourseSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = courses.filter(
    (c) =>
      (category === "Todos" || c.category === category) &&
      normalize(c.title + c.subtitle).includes(normalize(query)),
  );
  return (
    <section id="catalogo" className={styles.catalog}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>ELIGE TU CAMINO</p>
          <h2>Explora los cursos</h2>
        </div>
        <label className={styles.search}>
          Buscar cursos
          <input
            type="search"
            placeholder="¿Qué quieres aprender?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className={styles.filters} role="group" aria-label="Categorías">
        {["Todos", ...new Set(courses.map((c) => c.category))].map((c) => (
          <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className={styles.muted} aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "curso" : "cursos"}
      </p>
      <div className={styles.grid}>
        {filtered.map((course, index) => (
          <Link className={styles.card} key={course.slug} href={`/app/courses/${course.slug}`}>
            <div className={`${styles.cover} ${index % 2 ? styles.blue : ""}`}>
              <span>{course.category.toUpperCase()}</span>
              <strong aria-hidden="true">{course.category === "Método" ? "↗" : "{ }"}</strong>
              <small>ROKITG / ACADEMY</small>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.eyebrow}>
                {course.level} · {course.status === "demo" ? "Curso de muestra" : "Próximamente"}
              </p>
              <h3>{course.title}</h3>
              <p>{course.subtitle}</p>
              <div className={styles.cardFoot}>
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
      {filtered.length === 0 && (
        <div className={styles.empty}>
          <h3>No encontramos ese curso</h3>
          <p>Prueba otra búsqueda o vuelve a todas las categorías.</p>
          <button
            className={styles.button}
            onClick={() => {
              setQuery("");
              setCategory("Todos");
            }}
          >
            Ver todos
          </button>
        </div>
      )}
    </section>
  );
}
