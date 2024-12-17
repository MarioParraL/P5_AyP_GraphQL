# P5_AyP_GraphQL

Para esta quinta practica vamos a realizar una red social en GraphQL.
Modelos
type User {
  id: ID!
  name: String!
  password: String!
  email: String!
  posts: [Post!]!
  comments: [Comment!]!
  likedPosts: [Post!]!
}
 
type Post {
  id: ID!
  content: String!
  author: User!
  comments: [Comment!]!
  likes: [User!]!
}
 
type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}
 

Estos tipos hacen mencion al esquema de GraphQL, los modelos de base de datos NO deberan almacenar toda la informacion relacionada, solamente el ID del modelo
Importante
Las contraseñas deben estar cifradas, da igual el algoritmo que useis pero no se debe almacenar en bruto ese campo en base de datos
El email. es un campo unico, si ya existe en base de datos no se debe crear y debeis lanzar un error

Funciones
# Queries
type Query {
  users: [User!]!
  user(id: ID!): User
  
  posts: [Post!]!
  post(id: ID!): Post
  
  comments: [Comment!]!
  comment(id: ID!): Comment
}
 
# Mutations
type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
 
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
  
  addLikeToPost(postId: ID!, userId: ID!): Post!
  removeLikeFromPost(postId: ID!, userId: ID!): Post!
  
  createComment(input: CreateCommentInput!): Comment!
  updateComment(id: ID!, input: UpdateCommentInput!): Comment!
  deleteComment(id: ID!): Boolean!
}
 
Importante
Se debera devolver toda la informacion que el usuario pida de sus colecciones relacionadas. Ejemplo
query {
  comments {
    id
    text
    author {
      name
      email
      posts {
        id
        content
        likes {
          name
        }
        comments {
          id
          text
          author {
            name
          }
        }
      }
    }
}
 

Entrega
Se deberá entregar un enlace a Deno Deploy https://deno.com/deploy
Ese enlace deberá ser funcional
En caso de no mandarlo la práctica puntuará directamente con un 0
Se deberá mandar también el enlace al repositorio
Se debera mandar tambien el archivo adjunto al entregar
