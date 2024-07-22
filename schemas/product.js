const typeDefs = `#graphql
  type Product {
    id: ID
    name: String
    price: Int
  }

  type Query {
    getProducts: [Product]
  }
`;

const resolvers = {
  Query: {
    getProducts: () => {
      return []
    }
  }
}


module.exports = {
  productTypeDefs: typeDefs,
  productResolvers: resolvers
}