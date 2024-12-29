import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "schema.prisma");

let schema = fs.readFileSync(schemaPath, "utf8");

const useAdapter = process.env.USE_ADAPTER === "true";

// Remove the previewFeatures flag from the schema
if (!useAdapter) {
  schema = schema.replace(
    /(\s*previewFeatures = \["driverAdapters"\])/,
    '\n// previewFeatures = ["driverAdapters"]'
  );
  fs.writeFileSync(schemaPath, schema, "utf8");

  console.log("> Updated schema.prisma: removed driverAdapters feature");
}
