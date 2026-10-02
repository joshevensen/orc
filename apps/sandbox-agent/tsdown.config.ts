import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/main.ts"],
  format: "esm",
  platform: "node",
  target: "node24",
  // Workspace packages ship TypeScript source, so bundle them into the sandbox image entry.
  noExternal: [/^@orc\//],
});
