export const CONSENT_COOKIE = "rokitg_consent";
export const OPEN_CONSENT_EVENT = "rokitg:open-consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export type ConsentChoice = "granted" | "denied";
/** "optin": tracking stays off until the visitor accepts (EU/EEA, UK, Switzerland). "optout": it runs unless they decline. */
export type ConsentMode = "optin" | "optout";

// EU member states, the rest of the EEA, the UK and Switzerland.
const OPT_IN_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT",
  "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
]);

/** An unknown country counts as opt-in, so the safer rule applies whenever we can't tell where the visitor is. */
export function consentModeFor(country?: string | null): ConsentMode {
  return !country || OPT_IN_COUNTRIES.has(country.toUpperCase()) ? "optin" : "optout";
}

export function parseChoice(value?: string | null): ConsentChoice | undefined {
  return value === "granted" || value === "denied" ? value : undefined;
}

/** Whether analytics and advertising scripts may run. Global Privacy Control always means no. */
export function trackingAllowed(mode: ConsentMode, choice: ConsentChoice | undefined, gpc: boolean): boolean {
  if (gpc || choice === "denied") return false;
  return mode === "optout" || choice === "granted";
}

/** Browser only: remembers the choice for the server to read on the next request. */
export function storeChoice(choice: ConsentChoice) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

const TRACKER_COOKIE = /^(_ga|_gid|_gat|_gcl|_fb|_wuid|_whop)/;

/** Browser only: removes the cookies the analytics and advertising scripts set, when a visitor withdraws consent. */
export function clearTrackerCookies() {
  const hosts = [window.location.hostname, `.${window.location.hostname.replace(/^www\./, "")}`];
  for (const entry of document.cookie.split("; ")) {
    const name = entry.split("=")[0];
    if (!TRACKER_COOKIE.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    for (const domain of hosts) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}`;
  }
}
