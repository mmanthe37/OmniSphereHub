import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// 🆕 create a named constant for the configuration
const viteConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
})

// 🆕 export the named constant as the default export expected by the build system
export { viteConfig } // ESM named export
export default viteConfig // ESM default export

// ✅  Provide a CJS fallback for environments that do `require("./vite.config")`
/* c8 ignore next 3 */
if (typeof module !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  module.exports = viteConfig // CJS default export named viteConfig
}
