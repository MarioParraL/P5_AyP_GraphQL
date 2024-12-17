import { ApolloServer } from "@apollo/server";
import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.ts";
import { CommentModel, PostModel, UserModel } from "./types.ts";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("P5DB");
const UsersCollection = mongoDB.collection<UserModel>("users");
const PostCollection = mongoDB.collection<PostModel>("posts");
const CommentCollection = mongoDB.collection<CommentModel>("comments");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  // deno-lint-ignore require-await
  context: async () => ({ UsersCollection, PostCollection, CommentCollection }),
});

console.info(`Server ready at ${url}`);
