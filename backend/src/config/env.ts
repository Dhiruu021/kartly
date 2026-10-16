import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || "kartly_jwt_secret_dev_key_2026",
  COOKIE_SECRET: process.env.COOKIE_SECRET || "kartly_cookie_secret_dev_key",
};
