import { getEnv } from "../utils/get-env";

const appConfig = () => {
  const config = {
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: getEnv("PORT", "5000"),
    BASE_PATH: getEnv("BASE_PATH", "/api"),
    MONGO_URI: getEnv("MONGO_URI"),

    SESSION_SECRET: getEnv("SESSION_SECRET"),
    JWT_SECRET: getEnv("JWT_SECRET"),

    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN"),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
  };

  // Validate critical environment variables at startup
  const requiredVars = [
    'MONGO_URI',
    'SESSION_SECRET',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'FRONTEND_ORIGIN',
    'FRONTEND_GOOGLE_CALLBACK_URL'
  ];

  const missing = requiredVars.filter(key => !config[key as keyof typeof config]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('All required environment variables loaded');
  
  return config;
};

export const config = appConfig();
