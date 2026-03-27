import { routing } from "./lib/i18n/routing"
import messages from "./messages/en.json"

type Locale = (typeof routing.locales)[number]

declare module "use-intl" {
  interface AppConfig {
    Locale: Locale
    Messages: typeof messages
  }
}

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale
    Messages: typeof messages
  }
}
