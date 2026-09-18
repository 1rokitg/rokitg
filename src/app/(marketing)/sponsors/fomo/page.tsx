import Image from "next/image";
import styles from "./page.module.scss";
const FOMO_URL = "https://fomo.family/r/rokitg";
export const metadata = {
  title: "Download Fomo | RokitG",
  description:
    "Discover tokens, follow other traders, and carry Fomo on your phone. Get the download with RokitG's link.",
};
export default function FomoSponsorPage() {
  return (
    <article className={styles.page} lang="en">
      <section className={styles.hero}>
        <div className={styles.copy}>
          <div className={styles.brand}>
            <Image src="/images/fomo-logo.png" alt="Fomo" width={40} height={40} />
            <span>FOMO × ROKITG</span>
          </div>
          <p className={styles.eyebrow}>YOUR NEXT CRYPTO APP</p>
          <h1>
            The market moves.
            <br />
            <span>Take it with you.</span>
          </h1>
          <p className={styles.intro}>
            Discover tokens, follow other traders, and trade from your phone. All in Fomo, a
            trading app with a community one tap away.
          </p>
          <a className={styles.cta} href={FOMO_URL} data-analytics-source="fomo_hero">
            Download Fomo <span aria-hidden="true">↗</span>
          </a>
          <p className={styles.note}>
            Continue on Fomo to download the app.
            <br />
            Use creator code <strong>ROKITG</strong> when you sign up.
          </p>
          <a className={styles.secondary} href="#como-empezar">
            How to get started ↓
          </a>
        </div>
        <figure className={styles.visual}>
          <Image
            src="/images/fomo-app.png"
            alt="Fomo app view: tokens, trader activity, and portfolio on mobile"
            width={1197}
            height={1164}
            sizes="(max-width: 760px) 100vw, 600px"
            preload
          />
          <figcaption>Illustrative view of the app.</figcaption>
        </figure>
      </section>
      <section className={styles.features} aria-label="Discover Fomo">
        <div>
          <span>01 / DISCOVER</span>
          <h2>Explore new tokens</h2>
          <p>Follow market trends right from the app.</p>
        </div>
        <div>
          <span>02 / CONNECT</span>
          <h2>Follow other traders</h2>
          <p>See their activity in Fomo's social feed.</p>
        </div>
        <div>
          <span>03 / MOVE</span>
          <h2>From mobile to desktop</h2>
          <p>Access it from the web too, whenever you prefer.</p>
        </div>
      </section>
      <section id="como-empezar" className={styles.finish}>
        <div>
          <p className={styles.eyebrow}>START HERE</p>
          <h2>Your first step: get the app.</h2>
          <p>Open RokitG's link, download Fomo, and use creator code <strong>ROKITG</strong> when you create your account.</p>
        </div>
        <a className={styles.cta} href={FOMO_URL} data-analytics-source="fomo_footer">
          Download Fomo <span aria-hidden="true">↗</span>
        </a>
      </section>
    </article>
  );
}
