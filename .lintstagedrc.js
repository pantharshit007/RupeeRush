// .lintstagedrc.js
module.exports = {
  // Lint TypeScript and TypeScript React files
  "**/*.{ts,tsx}": (files) => {
    // Convert absolute paths to relative paths and wrap paths with spaces in quotes
    const relativePaths = files.map((file) => {
      const relativePath = file.replace(process.cwd() + "/", "");
      // Wrap path in quotes if it contains spaces
      return relativePath.includes(" ") ? `"${relativePath}"` : relativePath;
    });

    // Only proceed if there are files to lint
    if (relativePaths.length === 0) return [];

    return [
      // Run eslint without --fix flag to only show warnings/errors
      `eslint ${relativePaths.join(" ")}`,
      // Run TypeScript compiler to check types: wouldn't recommend using this preety nasty errors
      // `tsc --noEmit --pretty ${relativePaths.join(' ')}`
    ];
  },

  // Format various file types
  "**/*.{js,jsx,ts,tsx,json,md}": (files) => {
    // Convert paths and wrap paths with spaces in quotes
    const relativePaths = files.map((file) => {
      const relativePath = file.replace(process.cwd() + "/", "");
      return relativePath.includes(" ") ? `"${relativePath}"` : relativePath;
    });

    // Only proceed if there are files to format
    if (relativePaths.length === 0) return [];

    return [`prettier --write ${relativePaths.join(" ")}`];
  },
};
