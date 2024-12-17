import { Collection, ObjectId } from "mongodb";
import { CommentModel, PostModel, User, UserModel } from "./types.ts";
import { GraphQLError } from "graphql";

type Context = {
  UsersCollection: Collection<UserModel>;
  PostCollection: Collection<PostModel>;
  CommentCollection: Collection<CommentModel>;
};

type QueryUserArgs = {
  id: string;
};

type MutationCreateUserArgs = {
  id: string;
  name: string;
  password: string;
  email: string;
  posts: string[];
  comments: string[];
  likedPosts: string[];
};

export const resolvers = {
  Query: {
    users: async (
      _: unknown,
      __: unknown,
      ctx: Context,
    ): Promise<UserModel[]> => {
      return await ctx.UsersCollection.find().toArray();
    },

    user: async (
      _: unknown,
      args: QueryUserArgs,
      ctx: Context,
    ): Promise<UserModel> => {
      const { id } = args;

      const user = await ctx.UsersCollection.findOne({ _id: new ObjectId(id) });

      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }

      return user;
    },

    posts: async (
      _: unknown,
      __: unknown,
      ctx: Context,
    ): Promise<PostModel[]> => {
      return await ctx.PostCollection.find().toArray();
    },

    post: async (
      _: unknown,
      args: QueryUserArgs,
      ctx: Context,
    ): Promise<PostModel> => {
      const { id } = args;

      const post = await ctx.PostCollection.findOne({ _id: new ObjectId(id) });

      if (!post) {
        throw new Error(`Post with ID ${id} not found`);
      }

      return post;
    },

    comments: async (
      _: unknown,
      __: unknown,
      ctx: Context,
    ): Promise<CommentModel[]> => {
      return await ctx.CommentCollection.find().toArray();
    },

    comment: async (
      _: unknown,
      args: QueryUserArgs,
      ctx: Context,
    ): Promise<CommentModel> => {
      const { id } = args;

      const comment = await ctx.CommentCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!comment) {
        throw new Error(`Comment with ID ${id} not found`);
      }

      return comment;
    },
  },

  Mutation: {
    createUser: async (
      _: unknown,
      args: MutationCreateUserArgs,
      ctx: Context,
    ): Promise<UserModel> => {
      const { email, name, password, posts, comments, likedPosts } = args;
      const existsEmail = await ctx.UsersCollection.findOne({ email });
      if (existsEmail) throw new GraphQLError("Email Exists");

      const user = await ctx.UsersCollection.insertOne({
        email,
        name,
        password,
        posts: posts.map((f) => new ObjectId(f)),
        comments: comments.map((f) => new ObjectId(f)),
        likedPosts: likedPosts.map((f) => new ObjectId(f)),
      });

      return {
        _id: user.insertedId,
        email,
        name,
        posts: user.insertedId,
        comments,
        likedPosts,
      };
    },
  },

  User: {
    id: (parent: UserModel, _: unknown, ctx: Context) => {
      return parent._id!.toString();
    },

    posts: async (
      parent: UserModel,
      _: unknown,
      ctx: Context,
    ): Promise<PostModel[]> => {
      const ids = parent.posts;
      const posts = await ctx.PostCollection.find({ _id: { $in: ids } })
        .toArray();
      return posts;
    },

    comments: async (
      parent: UserModel,
      _: unknown,
      ctx: Context,
    ): Promise<CommentModel[]> => {
      const ids = parent.comments;
      const comments = await ctx.CommentCollection.find({ _id: { $in: ids } })
        .toArray();
      return comments;
    },
  },
};
