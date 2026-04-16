import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    head: {
      title: "Placey",
      link: [{ rel: "manifest", href: "/manifest.json" }],
    },
  },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@vueuse/nuxt"],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["maplibre-gl"],
    },
  },
});
