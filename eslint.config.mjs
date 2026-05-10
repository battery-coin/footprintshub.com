import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "vendor/**",
      "var/**",
      "generated/**",
      "pub/**",
      "app/**",
      "docs/legacy/**",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
