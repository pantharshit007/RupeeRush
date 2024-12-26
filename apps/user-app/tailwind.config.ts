import type { Config } from "tailwindcss";
import config from "@repo/ui/tailwind.config";

const webConfig = {
  ...config,
  presets: [config],
  theme: {
    extend: {
      colors: {
        richPurple: {
          "200": "#ffb2ff",
          "300": "#df92ff",
          "400": "#ba72ff",
          "500": "#9652ff",
          "600": "#7132f5",
          "700": "#520bea",
        },
        oceanBlue: {
          "200": "#7CC2FF", // Light sky
          "300": "#5A9EFF", // Bright blue
          "400": "#3B7FFF", // Medium blue
          "500": "#1E5EFF", // Rich blue
          "600": "#0B3EDB", // Deep blue
          "700": "#0024B7", // Dark blue
        },
        arcticBlue: {
          "200": "#8CEFFF", // Ice blue
          "300": "#64DFFF", // Crystal blue
          "400": "#38C6FF", // Bright arctic
          "500": "#1BA4FF", // Deep arctic
          "600": "#0B82DB", // Ocean depth
          "700": "#0563B7", // Arctic night
        },
        azureBlue: {
          "200": "#82D8FF", // Morning sky
          "300": "#5CB6FF", // Bright azure
          "400": "#3894FF", // Medium azure
          "500": "#1672FF", // Rich azure
          "600": "#0B54DB", // Deep azure
          "700": "#0038B7", // Night azure
        },
      },
      fontFamily: {
        // sans: ["var(--font-geist-sans)"],
        // mono: ["var(--font-geist-mono)"],
      },
    },
  },
} satisfies Config;

export default webConfig;
