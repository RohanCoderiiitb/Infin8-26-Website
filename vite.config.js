import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), imagetools()],
  assetsInclude: ["**/*.csv"],
});
