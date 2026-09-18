import { courses } from "@/lib/courses";
import { summarizeCourse } from "@/lib/course-catalog";
import { CourseCatalog } from "@/components/courses/CourseCatalog";
import styles from "./courses.module.scss";

export default function CoursesPage() {
  return (
    <>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>UN ESPACIO PARA PASAR A LA ACCIÓN</p>
          <h1>
            Tu siguiente paso
            <br />
            <em>empieza aquí.</em>
          </h1>
          <p className={styles.lead}>
            Lecciones claras, práctica y un camino que puedes seguir a tu ritmo. Bienvenido a tu
            aula.
          </p>
          <a className={styles.button} href="#catalogo">
            Explorar el catálogo <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <span className={styles.orbit}>R</span>
          <div>
            <small>APRENDE → PRACTICA → AVANZA</small>
            <strong>
              Una idea.
              <br />
              Un nuevo paso.
            </strong>
          </div>
        </div>
      </section>
      <div className={styles.notice}>
        Estás explorando una versión de muestra. Puedes probar las lecciones; las inscripciones de
        pago aún no están abiertas.
      </div>
      <CourseCatalog courses={courses.map(summarizeCourse)} />
    </>
  );
}
