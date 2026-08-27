import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        id: "/",
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
    src: "/pwa-192x192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/pwa-512x512.png",
    sizes: "512x512",
    type: "image/png",
  },
],
      },
    }),
  ],
});