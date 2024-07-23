require('dotenv').config()

const { ApolloServer } = require( '@apollo/server');
const { startStandaloneServer } = require( '@apollo/server/standalone');
const { bookTypeDefs, bookResolvers } = require('./schemas/book')
const { productTypeDefs, productResolvers } = require('./schemas/product');
const { mongoConnect } = require('./config/mongoConnection');
const { userTypeDefs, userResolvers } = require('./schemas/user');
const { GraphQLError } = require('graphql');
const { verifyToken } = require('./utils/jwt');
const { findUserById } = require('./models/user');

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
            // console.log('ini authentication di dalam context')
            const authorization = req.headers.authorization 

            if (!authorization) {
              throw new GraphQLError('Invalid Token', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: { status: 401 },
                },
              });
            }

            const token = authorization.split(' ')[1]

            if (!token) {
              throw new GraphQLError('Invalid Token', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: { status: 401 },
                },
              });
            }

            const decodeToken = verifyToken(token)

            const user = await findUserById(decodeToken.id)

            if (!user) {
              throw new GraphQLError('Invalid User', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: { status: 401 },
                },
              });
            }

            return {
              userId: user._id,
              username: user.username
            }
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