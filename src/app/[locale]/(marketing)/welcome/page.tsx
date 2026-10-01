import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { FaDiscord } from "react-icons/fa";
import { FiArrowDown, FiArrowUpRight, FiBookOpen, FiMessageCircle, FiPlay } from "react-icons/fi";
import styles from "./page.module.scss";

// Both Whop experiences are included in Free Community and Social Capital.
const DISCORD_ACCESS_URL = "https://whop.com/rokitg/exp_DSkH2hqtsdeM39/app/";
const COURSES_URL = "https://whop.com/rokitg/exp_p8nAF6RNdAM8kN/app/";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WelcomePage");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: true },
    alternates: { canonical: "https://www.rokitg.com/welcome" },
  };
}

export default async function WelcomePage() {
  const t = await getTranslations("WelcomePage");

  return (
    <article className={styles.page} aria-labelledby="welcome-title">
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1 id="welcome-title">
            {t.rich("heroTitle", { span: (chunks) => <span>{chunks}</span> })}
          </h1>
          <p className={styles.intro}>{t("intro")}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href={DISCORD_ACCESS_URL} data-analytics-source="welcome_hero_discord">
              <FaDiscord aria-hidden="true" /> {t("heroDiscordCta")} <FiArrowUpRight aria-hidden="true" />
            </a>
            <a className={styles.textLink} href="#primeros-pasos">
              {t("heroStepsLink")} <FiArrowDown aria-hidden="true" />
            </a>
          </div>
          <p className={styles.heroNote}>{t("heroNote")}</p>
        </div>
        <aside className={styles.hostNote} aria-label={t("hostAriaLabel")}>
          <div className={styles.hostIdentity}>
            <Image src="/images/gallery/pfp.jpg" alt="" width={80} height={80} sizes="80px" />
            <div><strong>RokitG</strong><span>{t("hostGreeting")}</span></div>
          </div>
          <p>{t("hostMessage")}</p>
          <span className={styles.signature}>{t("hostSignature")}</span>
        </aside>
      </section>

      <section id="primeros-pasos" className={styles.steps} aria-labelledby="steps-title">
        <div className={styles.sectionHeading}>
          <h2 id="steps-title">{t("stepsSectionTitle")}</h2>
          <p>{t("stepsSectionSubtitle")}</p>
        </div>

        <section className={`${styles.card} ${styles.discordCard}`} aria-labelledby="discord-title">
          <div className={styles.cardCopy}>
            <p className={styles.stepLabel}>{t("discordStepLabel")}</p>
            <div className={styles.iconBadge}><FaDiscord aria-hidden="true" /></div>
            <h3 id="discord-title">
              {t("discordTitleLine1")}
              <br />
              {t("discordTitleLine2")}
            </h3>
            <p>{t("discordBody")}</p>
            <a className={styles.primaryButton} href={DISCORD_ACCESS_URL} data-analytics-source="welcome_discord_connect">
              {t("discordConnectCta")} <FiArrowUpRight aria-hidden="true" />
            </a>
            <a className={styles.textLink} href={DISCORD_ACCESS_URL} data-analytics-source="welcome_discord_invite">
              {t("discordAlreadyConnected")} <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <div className={styles.connectionSteps}>
            <p className={styles.miniLabel}>{t("miniLabel")}</p>
            <ol>
              <li><span aria-hidden="true">1</span><div><h4>{t("step1Title")}</h4><p>{t("step1Body")}</p></div></li>
              <li><span aria-hidden="true">2</span><div><h4>{t("step2Title")}</h4><p>{t("step2Body")}</p></div></li>
              <li><span aria-hidden="true">3</span><div><h4>{t("step3Title")}</h4><p>{t("step3Body")}</p></div></li>
            </ol>
            <p className={styles.connectionNote}>{t("connectionNote")}</p>
          </div>
        </section>

        <div className={styles.cardGrid}>
          <section id="courses" className={`${styles.card} ${styles.coursesCard}`} aria-labelledby="courses-title">
            <p className={styles.stepLabel}>{t("coursesStepLabel")}</p>
            <div className={`${styles.iconBadge} ${styles.courseIcon}`}><FiBookOpen aria-hidden="true" /></div>
            <h3 id="courses-title">
              {t("coursesTitleLine1")}
              <br />
              {t("coursesTitleLine2")}
            </h3>
            <p>{t("coursesBody")}</p>
            <div className={styles.courseList} aria-label={t("coursesListAriaLabel")}>
              <div><span className={styles.courseNumber}>01</span><span>Memecoins Bootcamp</span><FiPlay aria-hidden="true" /></div>
              <div><span className={styles.courseNumber}>02</span><span>TradingView Sauce</span><FiPlay aria-hidden="true" /></div>
              <div><span className={styles.courseNumber}>03</span><span>Fomo App: Beguinner&apos;s Guide</span><FiPlay aria-hidden="true" /></div>
            </div>
            <a className={styles.outlineButton} href={COURSES_URL} data-analytics-source="welcome_courses">
              {t("coursesCta")} <FiArrowUpRight aria-hidden="true" />
            </a>
          </section>

          <section className={`${styles.card} ${styles.helloCard}`} aria-labelledby="hello-title">
            <p className={styles.stepLabel}>{t("helloStepLabel")}</p>
            <div className={`${styles.iconBadge} ${styles.helloIcon}`}><FiMessageCircle aria-hidden="true" /></div>
            <h3 id="hello-title">
              {t("helloTitleLine1")}
              <br />
              {t("helloTitleLine2")}
            </h3>
            <p>{t("helloBody")}</p>
            <blockquote className={styles.introduction}>
              <span>{t("icebreakerLabel")}</span>
              <p>{t("icebreakerExample")}</p>
            </blockquote>
            <p className={styles.encouragement}>{t("encouragement")}</p>
            <a className={styles.outlineButton} href={DISCORD_ACCESS_URL} data-analytics-source="welcome_introduce_yourself">
              {t("helloCta")} <FiArrowUpRight aria-hidden="true" />
            </a>
          </section>
        </div>
      </section>

      <section className={styles.help} aria-labelledby="help-title">
        <div>
          <p className={styles.eyebrow}>{t("helpEyebrow")}</p>
          <h2 id="help-title">{t("helpTitle")}</h2>
          <p>{t("helpBody")}</p>
          <a className={styles.textLink} href="mailto:1rokitg@gmail.com">{t("helpEmailCta")} <FiArrowUpRight aria-hidden="true" /></a>
        </div>
        <div className={styles.questions}>
          <details>
            <summary>{t("faq1Q")}</summary>
            <p>{t("faq1A")}</p>
          </details>
          <details>
            <summary>{t("faq2Q")}</summary>
            <p>
              {t.rich("faq2A", {
                link: (chunks) => (
                  <a href={DISCORD_ACCESS_URL} data-analytics-source="welcome_discord_help">
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </details>
          <details>
            <summary>{t("faq3Q")}</summary>
            <p>
              {t.rich("faq3A", {
                link: (chunks) => (
                  <a href={COURSES_URL} data-analytics-source="welcome_courses_help">
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </details>
        </div>
      </section>
    </article>
  );
}
