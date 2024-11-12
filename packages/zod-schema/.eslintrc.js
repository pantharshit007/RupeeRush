module.exports = {
  root: true,
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["src/**/*.ts"], // Match all .ts files in src and subdirectories
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "no-redeclare": "off",
      },
    },
  ],
};
