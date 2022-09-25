import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { UserResolver } from "../modules/users/resolver/UserResolver";

export const createSchema = async (): Promise<GraphQLSchema> => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });
  return schema;
};
