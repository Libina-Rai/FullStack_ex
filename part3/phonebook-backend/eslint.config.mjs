import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig({
  ignores: ["node_modules/", ".env", "dist/"], // <-- ignore these files/folders
  files: ["**/*.{js,mjs,cjs}"],
  plugins: { js },
  extends: ["js/recommended"],
  languageOptions: {
    globals: globals.node, // Node.js globals like process, __dirname
    sourceType: "commonjs",
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^next$" }], // ignore unused 'next' param
  },
});