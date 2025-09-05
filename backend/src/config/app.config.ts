import { getEnv } from "../utils/get-env";

const appConfig = () => {
  const config = {
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: getEnv("PORT", "5000"),
    BASE_PATH: getEnv("BASE_PATH", "/api"),
    MONGO_URI: getEnv("MONGO_URI", ""),

    SESSION_SECRET: getEnv("SESSION_SECRET"),
    JWT_SECRET: getEnv("JWT_SECRET"),

    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
  };



  return config;
};

export const config = appConfig();
