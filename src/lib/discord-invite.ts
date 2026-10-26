import "server-only";

export type DiscordServer = { name: string; iconUrl: string | null; members: number; online: number };

/** Name, icon and live counts of a server from its public invite. Returns null on any failure so the page falls back. */
export async function getDiscordServer(inviteCode: string): Promise<DiscordServer | null> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/invites/${encodeURIComponent(inviteCode)}?with_counts=true`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) return null;

    const body = (await response.json()) as {
      approximate_member_count?: number;
      approximate_presence_count?: number;
      guild?: { id?: string; name?: string; icon?: string | null };
    };
    const { guild, approximate_member_count: members, approximate_presence_count: online } = body;
    if (!guild?.id || !guild.name || typeof members !== "number" || typeof online !== "number") return null;

    const extension = guild.icon?.startsWith("a_") ? "gif" : "png";
    return {
      name: guild.name,
      iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${extension}?size=128` : null,
      members,
      online,
    };
  } catch {
    return null;
  }
}
