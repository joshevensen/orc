import { defineConfig } from "@hey-api/openapi-ts";

// Generated from the API's OpenAPI spec (C-5). Run after the API emits openapi.json.
export default defineConfig({
  input: "../../apps/api/openapi.json",
  output: "src/generated",
  plugins: ["@hey-api/client-fetch", "zod", "@tanstack/react-query"],
});
