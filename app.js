if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 4000;
const cors = require("cors");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const { mongoConnect } = require("./config/mongoConnection");
const { userTypeDefs, userResolvers } = require("./schemas/user");
const { responseTypeDefs } = require("./schemas/response");
const { authentication } = require("./utils/auth");
const { salesResolvers, salesTypeDefs } = require("./schemas/sales");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, salesTypeDefs, responseTypeDefs],
  resolvers: [userResolvers, salesResolvers],
  introspection: true,
  context: async ({ req, res }) => {
    return {
      authentication: async () => {
        return await authentication(req);
      },
    };
  },
});

(async () => {
  try {
    await mongoConnect();
    await server.start();

    console.log("Mongo Connected");

    const app = express();
    server.applyMiddleware({ app });

    app.use(cors());

    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.log("Error starting server:", error);
  }
})();
