// import * as x from "pm2/types";

/**
 * @typedef {import('pm2').StartOptions} StartOptions
 * @type {{ apps: StartOptions[] }}
 */
export default {
  apps: [
    {
      name: "app",
      cwd: "./podbast-app",
      interpreter: "npm",
      interpreter_args: "run dev",
      // watch: ".",
    },
    {
      name: "server-builder",
      cwd: "./podbast-server",
      interpreter: "npm",
      interpreter_args: "run dev",
    },
    {
      name: "server",
      cwd: "./podbast-server",
      script: "dist/index.js",
      watch: "dist/",
      // interpreter: "npm",
      // interpreter_args: "run dev",
    },
  ],
};
