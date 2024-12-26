import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import { resolve } from "node:path";
import { config } from "dotenv";

config();

export default defineConfig({
  server: {
    port: 3000,
    watch: {
      include: ["**/*.yml"],
      exclude: [],
    },
  },
  plugins: [
    ViteYaml(),
    ...VitePluginNode({
      adapter: "express",
      appPath: "index.js",
      exportName: "viteApp",
    }),
  ],
  environments: {
    NODE_ENV: "development",
  },
  watch: {
    include: ["**/*.yml"],
    exclude: [],
  },
  resolve: {
    alias: {
      "@config": resolve(__dirname, "./config"),
      "@controllers": resolve(__dirname, "./controllers"),
      "@middlewares": resolve(__dirname, "./middlewares"),
      "@routes": resolve(__dirname, "./routes"),
      "@utils": resolve(__dirname, "./utils"),
      "@validators": resolve(__dirname, "./utils/validators"),
    },
  },
  keepProcessEnv: true,
});
