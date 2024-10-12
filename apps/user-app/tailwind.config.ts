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
      },
    },
  },
} satisfies Config;

export default webConfig;
