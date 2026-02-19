import { defineConfig } from "vite";
import { resolve } from "node:path";

var repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[1] : "";
var pagesBase = repoName ? "/" + repoName + "/" : "/";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? pagesBase : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        recipe: resolve(__dirname, "recipe.html")
      }
    }
  }
});
