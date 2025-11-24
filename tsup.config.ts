import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["cjs"],
  target: "es2020",
  sourcemap: false,
  clean: true,
  outDir: "dist",
  onSuccess: "cp -r src/actions dist/actions",
});
