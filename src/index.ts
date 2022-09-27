import dotenv from "dotenv";
import express from "express";
import { DataSource } from "typeorm";
import config from "./config";
import { createSchema } from "./utils/createSchema";
import { ApolloServer } from "apollo-server-express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
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
const PORT = 4000;
const bootstrap = async () => {
  try {
    await MysqlDataSource.initialize();
    // Creating the WebSocket subscription server
    const app = express();
    const httpServer = createServer(app);
    // create schema
    const schema = await createSchema();

    const wsServer = new WebSocketServer({
      // This is the `httpServer` returned by createServer(app);
      server: httpServer,
      // Pass a different path here if your ApolloServer serves at
      // a different path.
      path: "/graphql",
    });

    // Passing in an instance of a GraphQLSchema and
    // telling the WebSocketServer to start listening
    const serverCleanup = useServer({ schema }, wsServer);
    const server = new ApolloServer({
      schema,
      plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
      ],
    });

    await server.start();
    server.applyMiddleware({ app });

    app.use(express.json());

    app.set("trust proxy", true);

    app.use("/healthcheck", require("express-healthcheck")());
    // Now that our HTTP server is fully set up, actually listen.
    httpServer.listen(PORT, () => {
      console.log(
        `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
      );
      console.log(
        `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    const err = error as Error;
    throw Error("Server error " + err.message);
  }
};

void bootstrap();
