import Link from "next/link";
import { notFound } from "next/navigation";
import { courseMinutes, getCourse } from "@/lib/courses";
import styles from "../courses.module.scss";
import { CourseCheckout } from "@/components/courses/CourseCheckout";
import { getCourseOffer } from "@/lib/course-offers";
import { formatCoursePrice } from "@/lib/course-catalog";

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  const offer = getCourseOffer(slug);
  if (!course) notFound();
  return (
    <>
      <Link className={styles.back} href="/app/courses">
        ← Todos los cursos
      </Link>
      <section className={styles.detail}>
        <div>
          <p className={styles.eyebrow}>
            {course.category} / {course.level}
          </p>
          <h1>{course.title}</h1>
          <p className={styles.lead}>{course.description}</p>
          <p className={styles.muted}>RokitG Academy · Español · A tu ritmo</p>
          {course.outcomes.length > 0 && (
            <>
              <h2>Lo que vas a practicar</h2>
              <ul className={styles.outcomes}>
                {course.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {course.status === "placeholder" && (
            <Link className={styles.back} href="/app/courses/tu-sistema-de-aprendizaje">
              Explorar una lección de muestra →
            </Link>
          )}
        </div>
        <aside className={styles.purchase}>
          <span className={styles.badge}>
            {course.status === "demo" ? "Acceso de muestra" : "Próximamente"}
          </span>
          <h2>{course.status === "demo" ? "Conoce el aula" : "Estamos preparando este curso"}</h2>
          <p>
            {course.status === "demo"
              ? `${course.lessons.length} lecciones de lectura · ${courseMinutes(course)} minutos aproximados`
              : "La fecha de apertura y el temario se anunciarán aquí."}
          </p>
          {course.lessons[0] && (
            <Link
              className={styles.button}
              href={`/app/courses/${course.slug}/${course.lessons[0].slug}`}
            >
              Empezar la muestra →
            </Link>
          )}
          <p className={styles.muted}>Inscripciones de pago aún no disponibles.</p>
        </aside>
      </section>
      {course.status === "placeholder" && (
        <section className={styles.purchase}>
          <p className={styles.eyebrow}>TUS PRIMEROS PASOS</p>
          <h2>
            Precio previsto del curso:{" "}
            {course.plannedPrice && formatCoursePrice(course.plannedPrice)}
          </h2>
          <p>
            El curso todavía no está a la venta. Por ahora puedes unirte a Free Comm gratis. Esta
            inscripción corresponde únicamente a la comunidad gratuita.
          </p>
          {offer && <CourseCheckout courseSlug={course.slug} offer={offer} />}
        </section>
      )}
      <section className={styles.catalog}>
        <h2>Contenido del curso</h2>
        {course.lessons.length ? (
          course.lessons.map((lesson, index) => (
            <Link
              className={styles.lessonRow}
              key={lesson.slug}
              href={`/app/courses/${course.slug}/${lesson.slug}`}
            >
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <strong>{lesson.title}</strong>
              <span>{lesson.minutes} min · Muestra ↗</span>
            </Link>
          ))
        ) : (
          <p className={styles.muted}>
            El temario estará disponible antes de abrir las inscripciones.
          </p>
        )}
      </section>
    </>
  );
}
