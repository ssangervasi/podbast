import path from "node:path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 42994,
    proxy: {
      "/api": {
        target: "http://localhost:42993",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [preact()],
  resolve: {
    alias: [
      // Actually already supports absolute imports
      // {
      //   find: "src",
      //   replacement: path.resolve(process.cwd(), "src"),
      // },
    ],
  },
});
