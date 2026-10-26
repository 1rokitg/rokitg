import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { baseURL, person } from "@/resources";
import { localizedMeta } from "@/lib/seo";
import styles from "./page.module.scss";

type Section = { title: string; body?: string[]; items?: string[]; after?: string[] };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PrivacyPage");
  return localizedMeta({ title: t("metaTitle"), description: t("metaDescription"), path: "/privacy" });
}

export default async function PrivacyPage() {
  const t = await getTranslations("PrivacyPage");
  const sections = t.raw("sections") as Section[];
  const withEmail = (text: string) => text.replaceAll("{email}", person.email);

  return (
    <article className={styles.page} aria-labelledby="privacy-title">
      <header className={styles.head}>
        <h1 id="privacy-title">{t("title")}</h1>
        <p className={styles.updated}>{t("updated")}</p>
        <p className={styles.intro}>{t("intro", { site: baseURL.replace(/^https?:\/\//, "") })}</p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className={styles.section}>
          <h2>{section.title}</h2>
          {section.body?.map((text) => <p key={text}>{withEmail(text)}</p>)}
          {section.items ? (
            <ul>
              {section.items.map((text) => (
                <li key={text}>{withEmail(text)}</li>
              ))}
            </ul>
          ) : null}
          {section.after?.map((text) => <p key={text}>{withEmail(text)}</p>)}
        </section>
      ))}
    </article>
  );
}
