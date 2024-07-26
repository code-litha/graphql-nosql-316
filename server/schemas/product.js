const { ObjectId } = require("mongodb");
const {
  findAllProducts,
  findOneProductById,
  createProduct,
  addImageUrlToProduct,
  addOrder,
} = require("../models/product");
const redis = require("../config/redis");
const DATA_PRODUCTS_KEY = "data:products";

const typeDefs = `#graphql
  type Product {
    _id: ID
    name: String
    price: Int
    stock: Int
    imgUrl: [String]
    description: String
    authorId: ID
    author: User
  }

  type Order {
    _id: ID
    productId: ID 
    userId: ID
    quantity: Int
    totalPrice: Int
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
    addOrder(productId: ID!, quantity: Int!): Order
  }
`;

const resolvers = {
  Query: {
    getProducts: async (_parent, _args, contextValue) => {
      /*
        1. check terlebih dahulu ke redis, ada ga data untuk products ? 
          kalau ada, itu yang akan di return
        2. kalau gak ada, maka akan hit ke database,
          lalu sebelum di return ke client, akan disimpan terlebih dahulu ke dalam redis
      */
      const productCache = await redis.get(DATA_PRODUCTS_KEY);

      // console.log(productCache, "<<< productCache");
      if (productCache) {
        return JSON.parse(productCache);
      }

      const products = await findAllProducts();

      await redis.set(DATA_PRODUCTS_KEY, JSON.stringify(products));

      return products;
    },
    getProductById: async (_parent, args) => {
      const { id } = args;
      const product = await findOneProductById(id);

      return product;
    },
  },
  Mutation: {
    addProduct: async (_parent, args, contextValue) => {
      const userLogin = await contextValue.authentication();
      const { name, price, imgUrl, description } = args.input;

      const dataProduct = await createProduct({
        name,
        price,
        imgUrl,
        description,
        authorId: new ObjectId(userLogin.userId),
      });

      redis.del(DATA_PRODUCTS_KEY); // INVALIDATE CACHE

      return dataProduct;
    },
    addImageUrl: async (_parent, args) => {
      const { imgUrl, id } = args;

      const product = await addImageUrlToProduct(id, imgUrl);

      redis.del(DATA_PRODUCTS_KEY); // INVALIDATE CACHE

      return product;
    },
    addOrder: async (_parent, args, contextValue) => {
      const userLogin = await contextValue.authentication();
      const { productId, quantity } = args;

      const order = await addOrder(productId, quantity, userLogin.userId);

      redis.del(DATA_PRODUCTS_KEY); // INVALIDATE CACHE

      return order;
    },
  },
};

module.exports = {
  productTypeDefs: typeDefs,
  productResolvers: resolvers,
};
