import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
     plugins: [
          react(),
          VitePWA({
               registerType: "autoUpdate", // Auto updates service worker
               devOptions: {
                    enabled: true, // Enable PWA in development
               },
               workbox: {
                    cleanupOutdatedCaches: true,
               },
               manifest: {
                    name: "Schneider |  Easy Pact Demo Portal",
                    short_name: "Schneider",
                    description: "Schneider |  Easy Pact Demo Portal",
                    theme_color: "#ffffff",
                    background_color: "#ffffff",
                    display: "standalone",
                    icons: [
                         {
                              src: "/images/favicon.jpeg",
                              sizes: "192x192",
                              type: "image/png",
                         },
                         {
                              src: "/images/favicon.jpeg",
                              sizes: "512x512",
                              type: "image/png",
                         },
                    ],
               },
          }),
     ],
});
