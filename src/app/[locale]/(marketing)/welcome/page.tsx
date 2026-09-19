import type { Metadata } from "next";
import Image from "next/image";
import { FaDiscord } from "react-icons/fa";
import { FiArrowDown, FiArrowUpRight, FiBookOpen, FiMessageCircle, FiPlay } from "react-icons/fi";
import styles from "./page.module.scss";

// Both Whop experiences are included in Free Community and Social Capital.
const DISCORD_ACCESS_URL = "https://whop.com/rokitg/exp_DSkH2hqtsdeM39/app/";
const COURSES_URL = "https://whop.com/rokitg/exp_p8nAF6RNdAM8kN/app/";

export const metadata: Metadata = {
  title: "Bienvenido a la comunidad | RokitG",
  description: "Tu punto de partida en RokitG: conecta Discord, explora Courses en Whop y conoce a la comunidad.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.rokitg.com/welcome" },
};

export default function WelcomePage() {
  return (
    <article className={styles.page} lang="es" aria-labelledby="welcome-title">
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>COMUNIDAD ROKITG · BIENVENIDA</p>
          <h1 id="welcome-title">Qué bueno tenerte <span>por aquí.</span></h1>
          <p className={styles.intro}>
            Aprender, compartir y avanzar con gente que está en el mismo camino.
            Tu próximo paso empieza dentro de la comunidad.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href={DISCORD_ACCESS_URL} data-analytics-source="welcome_hero_discord">
              <FaDiscord aria-hidden="true" /> Vamos a Discord <FiArrowUpRight aria-hidden="true" />
            </a>
            <a className={styles.textLink} href="#primeros-pasos">
              Ver los primeros pasos <FiArrowDown aria-hidden="true" />
            </a>
          </div>
          <p className={styles.heroNote}>Free Community o Social Capital: empieza aquí.</p>
        </div>
        <aside className={styles.hostNote} aria-label="Un mensaje de Rokit">
          <div className={styles.hostIdentity}>
            <Image src="/images/gallery/pfp.jpg" alt="" width={80} height={80} sizes="80px" />
            <div><strong>RokitG</strong><span>Nos vemos dentro.</span></div>
          </div>
          <p>Este espacio también es tuyo. Ven con curiosidad, comparte lo que aprendes y pregunta cuando algo no te encaje.</p>
          <span className={styles.signature}>Vamos paso a paso. — Rokit</span>
        </aside>
      </section>

      <section id="primeros-pasos" className={styles.steps} aria-labelledby="steps-title">
        <div className={styles.sectionHeading}>
          <h2 id="steps-title">Tres pasos para sentirte en casa.</h2>
          <p>Empieza por Discord. Lo demás, a tu ritmo.</p>
        </div>

        <section className={`${styles.card} ${styles.discordCard}`} aria-labelledby="discord-title">
          <div className={styles.cardCopy}>
            <p className={styles.stepLabel}>01 / CONECTA</p>
            <div className={styles.iconBadge}><FaDiscord aria-hidden="true" /></div>
            <h3 id="discord-title">La comunidad vive<br />en Discord.</h3>
            <p>Conecta tu cuenta desde Whop para entrar al servidor y acceder a los canales que incluye tu plan.</p>
            <a className={styles.primaryButton} href={DISCORD_ACCESS_URL} data-analytics-source="welcome_discord_connect">
              Conectar Discord en Whop <FiArrowUpRight aria-hidden="true" />
            </a>
            <a className={styles.textLink} href={DISCORD_ACCESS_URL} data-analytics-source="welcome_discord_invite">
              ¿Ya lo conectaste? Abre Discord en Whop <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <div className={styles.connectionSteps}>
            <p className={styles.miniLabel}>ASÍ DE SENCILLO</p>
            <ol>
              <li><span aria-hidden="true">1</span><div><h4>Abre tu acceso en Whop</h4><p>Inicia sesión con la cuenta que usaste al unirte.</p></div></li>
              <li><span aria-hidden="true">2</span><div><h4>Conecta tu Discord</h4><p>Selecciona la cuenta de Discord con la que quieres participar.</p></div></li>
              <li><span aria-hidden="true">3</span><div><h4>Activa tu acceso y entra</h4><p>Pulsa «Claim Access» y sigue el enlace al servidor.</p></div></li>
            </ol>
            <p className={styles.connectionNote}>Whop se encarga de vincular tu plan con Discord.</p>
          </div>
        </section>

        <div className={styles.cardGrid}>
          <section id="courses" className={`${styles.card} ${styles.coursesCard}`} aria-labelledby="courses-title">
            <p className={styles.stepLabel}>02 / EXPLORA</p>
            <div className={`${styles.iconBadge} ${styles.courseIcon}`}><FiBookOpen aria-hidden="true" /></div>
            <h3 id="courses-title">Tu siguiente idea<br />empieza en Courses.</h3>
            <p>Abre la app de cursos en Whop, explora el contenido disponible para tu acceso y elige una lección para empezar.</p>
            <div className={styles.courseList} aria-label="Una muestra de los cursos en Whop">
              <div><span className={styles.courseNumber}>01</span><span>Memecoins Bootcamp</span><FiPlay aria-hidden="true" /></div>
              <div><span className={styles.courseNumber}>02</span><span>TradingView Sauce</span><FiPlay aria-hidden="true" /></div>
              <div><span className={styles.courseNumber}>03</span><span>Fomo App: Beguinner&apos;s Guide</span><FiPlay aria-hidden="true" /></div>
            </div>
            <a className={styles.outlineButton} href={COURSES_URL} data-analytics-source="welcome_courses">
              Abrir Courses en Whop <FiArrowUpRight aria-hidden="true" />
            </a>
          </section>

          <section className={`${styles.card} ${styles.helloCard}`} aria-labelledby="hello-title">
            <p className={styles.stepLabel}>03 / DI HOLA</p>
            <div className={`${styles.iconBadge} ${styles.helloIcon}`}><FiMessageCircle aria-hidden="true" /></div>
            <h3 id="hello-title">Detrás de cada usuario,<br />hay una persona.</h3>
            <p>Cuando estés dentro, saluda y cuéntanos qué te trae por aquí. No hace falta una gran presentación.</p>
            <blockquote className={styles.introduction}>
              <span>UNA IDEA PARA ROMPER EL HIELO</span>
              <p>¡Hola! Soy ___, vengo de ___ y me he unido porque quiero aprender sobre ___. ¡Un placer estar aquí!</p>
            </blockquote>
            <p className={styles.encouragement}>Puedes empezar con una pregunta. Todos hemos tenido una primera.</p>
            <a className={styles.outlineButton} href={DISCORD_ACCESS_URL} data-analytics-source="welcome_introduce_yourself">
              Ir a Discord <FiArrowUpRight aria-hidden="true" />
            </a>
          </section>
        </div>
      </section>

      <section className={styles.help} aria-labelledby="help-title">
        <div>
          <p className={styles.eyebrow}>TE ECHAMOS UNA MANO</p>
          <h2 id="help-title">¿Algo no encaja?</h2>
          <p>Guarda esta página. Siempre puedes volver a estos primeros pasos.</p>
          <a className={styles.textLink} href="mailto:1rokitg@gmail.com">Escríbenos <FiArrowUpRight aria-hidden="true" /></a>
        </div>
        <div className={styles.questions}>
          <details>
            <summary>¿Esto sirve para mi plan?</summary>
            <p>Sí. Tanto Free Community como Social Capital empiezan aquí. En Whop y Discord encontrarás los contenidos y canales disponibles para tu acceso.</p>
          </details>
          <details>
            <summary>Estoy en Discord, pero no veo mis canales.</summary>
            <p>Comprueba que estás usando la misma cuenta de Whop con la que te uniste y la cuenta de Discord que conectaste. <a href={DISCORD_ACCESS_URL} data-analytics-source="welcome_discord_help">Vuelve a Discord en Whop</a> para revisar tu acceso.</p>
          </details>
          <details>
            <summary>¿Dónde encuentro los cursos?</summary>
            <p>Están en la app Courses de RokitG en Whop. <a href={COURSES_URL} data-analytics-source="welcome_courses_help">Ábrela aquí</a> e inicia sesión con tu cuenta habitual.</p>
          </details>
        </div>
      </section>
    </article>
  );
}
