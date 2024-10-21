/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["src/components/**/*.tsx"], // Target all components and subcomponents
      rules: {
        "no-unused-vars": "off", // Disable no-unused-vars for these files
        "no-redeclare": "off",   // Disable no-redeclare for these files
      },
    },
  ],
  ignorePatterns: [
    "tailwind.config.ts", // Exclude this file from being linted
    "src/components/ui/*.tsx" // Ignore the ShadCN components in the ui folder
  ],
};
