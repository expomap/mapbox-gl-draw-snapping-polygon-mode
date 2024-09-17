import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/*", "dist/*"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    }
  }
];