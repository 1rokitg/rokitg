import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FaDiscord } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { baseURL } from "@/resources";
import styles from "./page.module.scss";

// Both Whop experiences are included in Free Community and Social Capital.
const DISCORD_ACCESS_URL = "https://whop.com/rokitg/exp_DSkH2hqtsdeM39/app/";
const DISCORD_PATH = "/discord";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DiscordPage");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: true },
    alternates: { canonical: `${baseURL}${DISCORD_PATH}` },
  };
}

export default async function DiscordPage() {
  const t = await getTranslations("DiscordPage");

  return (
    <article className={styles.page} aria-labelledby="discord-title">
      <section className={styles.hero}>
        <div className={styles.iconBadge}>
          <FaDiscord aria-hidden="true" />
        </div>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h1 id="discord-title">{t("title")}</h1>
        <p className={styles.intro}>{t("intro")}</p>
        <a
          className={styles.primaryButton}
          href={DISCORD_ACCESS_URL}
          data-analytics-source="discord_page_connect"
        >
          <FaDiscord aria-hidden="true" /> {t("cta")} <FiArrowUpRight aria-hidden="true" />
        </a>
      </section>

      <ol className={styles.steps}>
        <li>
          <span aria-hidden="true">1</span>
          <div>
            <h2>{t("step1Title")}</h2>
            <p>{t("step1Body")}</p>
          </div>
        </li>
        <li>
          <span aria-hidden="true">2</span>
          <div>
            <h2>{t("step2Title")}</h2>
            <p>{t("step2Body")}</p>
          </div>
        </li>
        <li>
          <span aria-hidden="true">3</span>
          <div>
            <h2>{t("step3Title")}</h2>
            <p>{t("step3Body")}</p>
          </div>
        </li>
      </ol>

      <p className={styles.help}>
        {t("helpText")}{" "}
        <a href="mailto:1rokitg@gmail.com" data-analytics-source="discord_page_help">
          {t("helpLink")}
        </a>
      </p>
    </article>
  );
}
