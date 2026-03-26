import { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {}

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./lib/i18n/request.ts",
})
export default withNextIntl(nextConfig)
