import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// 🆕 create a named constant for the configuration
const __dirname = new URL(".", import.meta.url).pathname

const viteConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
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
