import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FiLock, FiCheckCircle, FiSmartphone } from "react-icons/fi";
import { Meta, Schema } from "@once-ui-system/core";
import { baseURL } from "@/resources";
import styles from "./page.module.scss";
const FOMO_URL = "https://fomo.family/r/rokitg";
const CREATOR_CODE = "ROKITG";
const SPONSOR_PATH = "/sponsors/fomo";

export async function generateMetadata() {
  const t = await getTranslations("FomoSponsorPage");
  return Meta.generate({
    title: t("metaTitle"),
    description: t("metaDescription"),
    baseURL: baseURL,
    path: SPONSOR_PATH,
    image: `/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`,
  });
}

export default async function FomoSponsorPage() {
  const t = await getTranslations("FomoSponsorPage");
  return (
    <article className={styles.page}>
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={t("metaTitle")}
        description={t("metaDescription")}
        path={SPONSOR_PATH}
        image={`/api/og/generate?title=${encodeURIComponent(t("metaTitle"))}`}
      />
      <section className={styles.hero}>
        <div className={styles.copy}>
          <div className={styles.brand}>
            <Image src="/images/fomo-logo.png" alt="Fomo" width={40} height={40} />
            <span>{t("brandTag")}</span>
          </div>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1>
            {t("heroTitleLine1")}
            <br />
            <span>{t("heroTitleLine2")}</span>
          </h1>
          <p className={styles.intro}>{t("intro")}</p>
          <a className={styles.cta} href={FOMO_URL} data-analytics-source="fomo_hero">
            {t("downloadCta")} <span aria-hidden="true">↗</span>
          </a>
          <div className={styles.trustRow}>
            <span>
              <FiLock aria-hidden="true" /> {t("trustVerified")}
            </span>
            <span>
              <FiCheckCircle aria-hidden="true" /> {t("trustCode")}
            </span>
            <span>
              <FiSmartphone aria-hidden="true" /> {t("trustPlatform")}
            </span>
          </div>
          <p className={styles.note}>
            {t("note")}
            <br />
            {t.rich("noteCode", { code: CREATOR_CODE, b: (chunks) => <strong>{chunks}</strong> })}
          </p>
          <a className={styles.secondary} href="#como-empezar">
            {t("secondaryCta")} ↓
          </a>
        </div>
        <figure className={styles.visual}>
          <Image
            src="/images/fomo-app.png"
            alt={t("visualAlt")}
            width={1197}
            height={1164}
            sizes="(max-width: 760px) 100vw, 600px"
            preload
          />
          <figcaption>{t("visualCaption")}</figcaption>
        </figure>
      </section>
      <section className={styles.features} aria-label={t("featuresAriaLabel")}>
        <div>
          <span>{t("feature1Tag")}</span>
          <h2>{t("feature1Title")}</h2>
          <p>{t("feature1Body")}</p>
        </div>
        <div>
          <span>{t("feature2Tag")}</span>
          <h2>{t("feature2Title")}</h2>
          <p>{t("feature2Body")}</p>
        </div>
        <div>
          <span>{t("feature3Tag")}</span>
          <h2>{t("feature3Title")}</h2>
          <p>{t("feature3Body")}</p>
        </div>
      </section>
      <section id="como-empezar" className={styles.finish}>
        <div>
          <p className={styles.eyebrow}>{t("finishEyebrow")}</p>
          <h2>{t("finishTitle")}</h2>
          <p>{t.rich("finishBody", { code: CREATOR_CODE, b: (chunks) => <strong>{chunks}</strong> })}</p>
        </div>
        <a className={styles.cta} href={FOMO_URL} data-analytics-source="fomo_footer">
          {t("downloadCta")} <span aria-hidden="true">↗</span>
        </a>
      </section>
    </article>
  );
}
