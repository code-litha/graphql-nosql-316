require('dotenv').config()

const { ApolloServer } = require( '@apollo/server');
const { startStandaloneServer } = require( '@apollo/server/standalone');
const { bookTypeDefs, bookResolvers } = require('./schemas/book')
const { productTypeDefs, productResolvers } = require('./schemas/product');
const { mongoConnect } = require('./config/mongoConnection');
const { userTypeDefs, userResolvers } = require('./schemas/user');
const authentication = require('./utils/auth');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [bookTypeDefs, productTypeDefs, userTypeDefs],
  resolvers: [bookResolvers, productResolvers, userResolvers],
});

// IIFE
(async () => {
  try {
    await mongoConnect()
    const { url } = await startStandaloneServer(server, {
      context: async ({ req, res }) => {
        return {
          authentication: async () => {
            return await authentication(req)
          }
        }
      },
      listen: { port: 4000 },
    }); 

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error)
  }
})();