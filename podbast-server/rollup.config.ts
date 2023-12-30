import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

// import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
  input: {
    index: "src/index.ts",
  },
  output: {
    format: "module",
    dir: "dist",
    plugins: [typescript()],
  },
});
