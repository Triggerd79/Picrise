import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";

const compat = new FlatCompat();

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
  ...compat.extends("plugin:prettier/recommended"),
];
