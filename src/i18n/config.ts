export const defaultLocale = "hy";

export const locales = ["hy", "en", "ru"] as const;
export type Locale = (typeof locales)[number];
