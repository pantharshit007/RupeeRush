/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["src/**/*.ts"], // Match all .ts files in src and subdirectories
      rules: {
        "no-console": "off",
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-unused-vars": ["off", { argsIgnorePattern: "^_" }],
        "no-redeclare": "off",
      },
    },
  ],
};
