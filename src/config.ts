import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || "local";

const config = {
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_PORT: (process.env.DATABASE_PORT || 3306) as number,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
};
export default config;
