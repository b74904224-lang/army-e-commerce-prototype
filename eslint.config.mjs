// ESLint flat config for Next.js 16 (eslint-config-next ships native flat config).
import next from "eslint-config-next/core-web-vitals"

const eslintConfig = [
  ...next,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // The backend has its own toolchain/tsconfig.
      "server/**",
      // Vendored shadcn/ui primitives — not hand-maintained here.
      "components/ui/**",
    ],
  },
  {
    rules: {
      // This storefront intentionally uses <img> (raw mat photos rendered with
      // object-contain, external/blob sources) rather than next/image.
      "@next/next/no-img-element": "off",
      // Reading persisted session/cart from localStorage during hydration is a
      // valid, intentional one-time setState in an effect.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]

export default eslintConfig
