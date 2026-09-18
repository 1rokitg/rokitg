import Image from "next/image";
import styles from "./page.module.scss";
const FOMO_URL = "https://fomo.family/r/rokitg";
export const metadata = {
  title: "Descarga Fomo | RokitG",
  description:
    "Descubre tokens, sigue a otros traders y lleva Fomo en tu móvil. Accede a la descarga con el enlace de RokitG.",
};
export default function FomoSponsorPage() {
  return (
    <article className={styles.page} lang="es">
      <section className={styles.hero}>
        <div className={styles.copy}>
          <div className={styles.brand}>
            <Image src="/images/fomo-logo.png" alt="Fomo" width={40} height={40} />
            <span>FOMO × ROKITG</span>
          </div>
          <p className={styles.eyebrow}>TU PRÓXIMA APP DE CRIPTO</p>
          <h1>
            El mercado se mueve.
            <br />
            <span>Llévalo contigo.</span>
          </h1>
          <p className={styles.intro}>
            Descubre tokens, sigue a otros traders y opera desde tu móvil. Todo en Fomo, una app de
            trading con una comunidad a un toque.
          </p>
          <a className={styles.cta} href={FOMO_URL} data-analytics-source="fomo_hero">
            Descargar Fomo <span aria-hidden="true">↗</span>
          </a>
          <p className={styles.note}>
            Continúa en Fomo para descargar la app.
            <br />
            Usa el código de creador <strong>ROKITG</strong> al registrarte.
          </p>
          <a className={styles.secondary} href="#como-empezar">
            Cómo empezar ↓
          </a>
        </div>
        <figure className={styles.visual}>
          <Image
            src="/images/fomo-app.png"
            alt="Vista de la app Fomo: tokens, actividad de traders y cartera en el móvil"
            width={1197}
            height={1164}
            sizes="(max-width: 760px) 100vw, 600px"
            preload
          />
          <figcaption>Vista ilustrativa de la app.</figcaption>
        </figure>
      </section>
      <section className={styles.features} aria-label="Descubre Fomo">
        <div>
          <span>01 / DESCUBRE</span>
          <h2>Explora nuevos tokens</h2>
          <p>Sigue las tendencias del mercado desde la app.</p>
        </div>
        <div>
          <span>02 / CONECTA</span>
          <h2>Sigue a otros traders</h2>
          <p>Descubre su actividad en el feed social de Fomo.</p>
        </div>
        <div>
          <span>03 / MUÉVETE</span>
          <h2>Del móvil al ordenador</h2>
          <p>Accede también desde la web cuando lo prefieras.</p>
        </div>
      </section>
      <section id="como-empezar" className={styles.finish}>
        <div>
          <p className={styles.eyebrow}>EMPIEZA POR AQUÍ</p>
          <h2>Tu primer paso: tener la app.</h2>
          <p>Abre el enlace de RokitG, descarga Fomo y usa el código de creador <strong>ROKITG</strong> al crear tu cuenta.</p>
        </div>
        <a className={styles.cta} href={FOMO_URL} data-analytics-source="fomo_footer">
          Descargar Fomo <span aria-hidden="true">↗</span>
        </a>
      </section>
    </article>
  );
}
