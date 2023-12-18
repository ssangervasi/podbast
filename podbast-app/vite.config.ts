import path from "node:path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: [
      // {
      //   find: "src",
      //   replacement: path.resolve(process.cwd(), "src"),
      // },
    ],
  },
});
