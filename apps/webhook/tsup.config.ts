import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  noExternal: ["@repo"], // Bundle any package starting with `@repo` and their dependencies
  splitting: false,
  bundle: true,
  outDir: "./dist",
  clean: true,
  env: { IS_SERVER_BUILD: "true" },
  loader: { ".json": "copy" },
  minify: typeof options.env === "string" && options.env === "production",
  sourcemap: typeof options.env === "string" && options.env === "production" ? "inline" : true,
  watch: options.watch,
}));
