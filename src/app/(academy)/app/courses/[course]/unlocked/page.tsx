import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/courses";
import styles from "../../courses.module.scss";

// The Whop webhook grants access asynchronously — a successful redirect here is not
// itself proof of purchase, it just means checkout completed. Give it a moment.
export default async function CourseUnlockedPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <section className={styles.empty}>
      <p className={styles.eyebrow}>PAGO COMPLETADO</p>
      <h1>Estamos activando tu acceso</h1>
      <p>
        Tu compra de <strong>{course.title}</strong> se está procesando. Puede tardar unos segundos
        en desbloquearse — si al entrar sigue bloqueado, espera un momento y vuelve a intentarlo.
      </p>
      <Link className={styles.button} href={`/app/courses/${slug}`}>
        Ir al curso →
      </Link>
    </section>
  );
}
