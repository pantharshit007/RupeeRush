// i think this is not the best way to do this
// since it will blatanlty expose the env variables to the client side
// i think we may need to use some lib like next-env or something: https://github.com/Codehagen/Dingify/blob/main/apps/www/src/env.ts

export const env = {
  BANK_API_URL: import.meta.env.VITE_BANK_API_URL,
};
