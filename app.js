const { ApolloServer } = require( '@apollo/server');
const { startStandaloneServer } = require( '@apollo/server/standalone');
const { bookTypeDefs, bookResolvers } = require('./schemas/book')
const { productTypeDefs, productResolvers } = require('./schemas/product')

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [bookTypeDefs, productTypeDefs],
  resolvers: [bookResolvers, productResolvers],
});

// IIFE
(async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    }); 

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error)
  }
})();