import { getLocale, getTranslations } from "next-intl/server";
import { FaDiscord, FaUserGroup } from "react-icons/fa6";
import type { DiscordServer } from "@/lib/discord-invite";
import styles from "./DiscordPreview.module.scss";

const MIN_CHANNELS = 3;

type Props = { server: DiscordServer; channels: string[] };

/** A small Discord-style card for the server: icon, name and live member / online counts. Numbers need no translation. */
export async function DiscordPreview({ server, channels }: Props) {
  const t = await getTranslations("DiscordPreview");
  const locale = await getLocale();
  const format = new Intl.NumberFormat(locale).format;

  return (
    <section className={styles.card} aria-label={server.name}>
      <header className={styles.header}>
        {server.iconUrl ? (
          <img
            className={styles.icon}
            src={server.iconUrl}
            width={64}
            height={64}
            alt=""
            referrerPolicy="no-referrer"
            fetchPriority="high"
          />
        ) : (
          <span className={styles.icon} aria-hidden="true">
            <FaDiscord />
          </span>
        )}
        <div className={styles.meta}>
          <h2 className={styles.name}>{server.name}</h2>
          <p className={styles.counts}>
            <span className={styles.count} aria-label={t("online", { count: server.online })}>
              <span className={styles.dot} aria-hidden="true" />
              <strong>{format(server.online)}</strong>
              <span className={styles.label}>{t("onlineLabel")}</span>
            </span>
            <span className={styles.count} aria-label={t("members", { count: server.members })}>
              <FaUserGroup className={styles.people} aria-hidden="true" />
              <strong>{format(server.members)}</strong>
              <span className={styles.label}>{t("membersLabel")}</span>
            </span>
          </p>
        </div>
        <FaDiscord className={styles.logo} aria-hidden="true" />
      </header>

      {channels.length >= MIN_CHANNELS ? (
        <ul className={styles.channels}>
          {channels.map((channel) => (
            <li key={channel} className={styles.channel}>
              <span aria-hidden="true">#</span> {channel}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
