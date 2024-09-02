const { GraphQLError } = require("graphql");
const { fetchSales } = require("../models/sales");

const typeDefs = `#graphql

type Sales {
    _id: ID!
    revenue: Int!
    month: String!
}


type Query {
        Sales: FetchSales
    }
`;

const resolvers = {
  Query: {
    Sales: async () => {
      const sales = await fetchSales();
      return {
        statusCode: 200,
        message: "Success fetch all sales",
        data: sales,
      };
    },
  },
};

module.exports = {
  salesTypeDefs: typeDefs,
  salesResolvers: resolvers,
};
