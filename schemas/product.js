const { findAllProducts, findOneProductById, createProduct, addImageUrlToProduct } = require("../models/product");

const typeDefs = `#graphql
  type Product {
    _id: ID
    name: String
    price: Int
    imgUrl: [String]
    description: String
    tags: [Tag]   #embedded document
  }

  type Tag {
    name: String
  }

  input CreateProductInput {
    name: String!
    price: Int!
    imgUrl: [String!]!
    description: String!
  }

  type Query {
    getProducts: [Product]
    getProductById(id: ID): Product
  }

  type Mutation {
    addProduct(input: CreateProductInput): Product 
    addImageUrl(imgUrl: String!, id: ID!): Product
  }
`;

const resolvers = {
  Query: {
    getProducts: async () => {
      const products = await findAllProducts()

      return products
    },
    getProductById: async (_parent, args) => {
      const { id } = args
      const product = await findOneProductById(id)
      
      return product
    }
  },
  Mutation: {
    addProduct: async (_parent, args) => {
      const { name, price, imgUrl, description } = args.input
     
      const dataProduct = await createProduct({
        name,
        price,
        imgUrl,
        description
      })

      return dataProduct
    },
    addImageUrl: async (_parent, args) => {
      const { imgUrl, id } = args

     return await addImageUrlToProduct(id, imgUrl)
    }
  }
}


module.exports = {
  productTypeDefs: typeDefs,
  productResolvers: resolvers
}