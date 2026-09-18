import Link from "next/link";
import styles from "../../courses.module.scss";

// A return URL or browser callback is not proof of payment or membership.
export default function CheckoutReturnPage() {
  return (
    <section className={styles.empty}>
      <p className={styles.eyebrow}>FREE COMM</p>
      <h1>Continúa tu recorrido</h1>
      <p>
        Consulta en Whop si tu inscripción a la comunidad se ha completado. Si saliste antes de
        terminar, puedes volver al formulario.
      </p>
      <p>El curso de 20 € sigue en preparación; este paso no compra ni desbloquea ese curso.</p>
      <a className={styles.button} href="https://whop.com/rokitg/free-comm/">
        Consultar mi acceso en Whop ↗
      </a>
      <p>
        <Link href="/app/courses/tus-primeros-pasos">Volver a la inscripción</Link> ·{" "}
        <Link href="/app/courses/library">Mi aprendizaje</Link>
      </p>
    </section>
  );
}
