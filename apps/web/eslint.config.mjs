import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  // Globally ignore generated/build output directories
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  // TypeScript files: use @typescript-eslint parser + recommended rules
  ...tseslint.configs.recommended,
  // Next.js plugin rules (no-html-link-for-pages, no-img-element, etc.)
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  // jsx-a11y: accessibility rules
  {
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
  },
  // Custom rule overrides matching the original .eslintrc.json
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // React rules (Next.js core-web-vitals)
      "react/prop-types": "off",
    },
  },
);
