import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "node",
  target: "node24",
  // Workspace packages ship TypeScript source, so bundle them into the CLI.
  noExternal: [/^@orc\//],
});
