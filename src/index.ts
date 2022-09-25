import dotenv from "dotenv";
import express from "express";
import { DataSource } from "typeorm";
import config from "./config";
import { createSchema } from "./utils/createSchema";
import { ApolloServer } from "apollo-server";

dotenv.config();

export const MysqlDataSource = new DataSource({
  type: "mysql",
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  synchronize: true,
  entities: ["dist/entities/*.js", "dist/modules/*/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
  subscribers: ["src/subscriber/**/*.ts"],
});

const bootstrap = async () => {
  try {
    await MysqlDataSource.initialize();

    // create schema
    const schema = await createSchema();
    const server = new ApolloServer({ schema });
    const app = express();

    app.use(express.json());

    app.set("trust proxy", true);

    app.use("/healthcheck", require("express-healthcheck")());

    server.listen(4000, () =>
      console.log(`🚀 Server ready at: http://localhost:4000`)
    );
  } catch (error) {
    const err = error as Error;
    throw Error("Server error " + err.message);
  }
};

void bootstrap();
