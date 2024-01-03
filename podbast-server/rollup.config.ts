import { defineConfig } from "rollup";
import tsplugin from "@rollup/plugin-typescript";

import pkg from "./package.json" assert { type: "json" };

// See: https://github.com/rollup/plugins/pull/1578
const typescript = tsplugin as unknown as typeof tsplugin.default;

export default defineConfig({
  input: "src/index.ts",
  external: [
    // Bundling nothing in server app.
    /node:.*/,
    ...Object.keys(pkg.dependencies),
  ],
  output: {
    format: "module",
    dir: "dist",
  },
  plugins: [typescript()],
});
