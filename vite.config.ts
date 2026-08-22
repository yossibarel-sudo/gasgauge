import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "GasGauge",
        short_name: "GasGauge",
        description:
          "LPG cylinder monitoring and consumption prediction",
        theme_color: "#1976d2",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",

        icons: [
  {
    src: "/favicon.svg",
    sizes: "any",
    type: "image/svg+xml",
  },
],
      },
    }),
  ],
});