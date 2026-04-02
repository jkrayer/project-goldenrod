export const APP_VARIANTS = ["freemium", "full"] as const;

export type AppVariant = (typeof APP_VARIANTS)[number];

export interface WebAppConfig {
  appName: string;
  appVariant: AppVariant;
  apiBaseUrl: string;
  releaseVersion: string;
}

const DEFAULT_API_BASE_URL = "http://localhost:3000";
const DEFAULT_RELEASE_VERSION = "0.1.0";

const isAppVariant = (value: string): value is AppVariant =>
  APP_VARIANTS.includes(value as AppVariant);

const toNonEmptyString = (
  value: string | undefined,
  fallback: string,
): string => {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export const resolveWebAppConfig = (
  env: Record<string, string | undefined>,
  defaults: { appName: string; appVariant: AppVariant },
): WebAppConfig => {
  const variant = toNonEmptyString(env.VITE_APP_VARIANT, defaults.appVariant);

  return {
    appName: toNonEmptyString(env.VITE_APP_NAME, defaults.appName),
    appVariant: isAppVariant(variant) ? variant : defaults.appVariant,
    apiBaseUrl: toNonEmptyString(env.VITE_API_BASE_URL, DEFAULT_API_BASE_URL),
    releaseVersion: toNonEmptyString(
      env.VITE_RELEASE_VERSION,
      DEFAULT_RELEASE_VERSION,
    ),
  };
};
