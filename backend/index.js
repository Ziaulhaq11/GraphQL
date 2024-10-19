const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
const { TODOS } = require("./data/todos");
const { USERS } = require("./data/users");

// TODOS.map((todo) => {
//   if (todo.id === 4) todo.title = "zia";
// });

//If you want to fetch anything from GraphQL you've to create Query. And if you're giving something to GraphQL it is mutation.
async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
        type User {
            id : ID!
            name : String!
            username : String
            email : String!
            phone : String!
            website : String!
        }
        type Todo {
            id : ID!
            title : String!
            completed : Boolean 
            userId : ID!
            user : User
        }
        type Query {
            getTodos : [Todo]
            getAllUsers : [User]
            getUser(id : ID!) : User 
        }
        type Mutation {
          deleteTodo(id : ID!) : String
        }
    `,
    resolvers: {
      Todo: {
        //Here we're saying whenever in Todo user field fetches it will call this api.
        user: (todo) => USERS.find((user) => user.id === todo.userId),
      },
      Query: {
        getTodos: () => TODOS,
        getAllUsers: () => USERS,
        getUser: (parent, { id }) => {
          return USERS.find((user) => user.id == id);
        },
      },
      Mutation: {
        deleteTodo: (_, { id }) => {
          let todo = TODOS.find((todo) => todo.id == id);
          if (!todo) {
            return "Book not found";
          }
          TODOS.filter((todo) => todo.id !== id);
          return "Done";
        },
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(8001, () => console.log("Server started at port 8000"));
}
startServer();

/**resolvers: {
      Todo: {
        //Here we're saying whenever in Todo user field fetches it will call this api.
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data,
      },
      Query: {
        // getTodos: () => [
        //   { id: 1, title: "Something special", completed: false },
        // ],
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) => {
          console.log(parent);
          return (
            await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
          ).data;
        },
      },
    } */
