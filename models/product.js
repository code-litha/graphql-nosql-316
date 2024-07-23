const { ObjectId } = require("mongodb");
const { getDatabase, client } = require("../config/mongoConnection");
const { GraphQLError } = require("graphql");

const productCollection = () => {
  return getDatabase().collection("products");
};

const findAllProducts = async () => {
  const agg = [
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "author.password": 0,
      },
    },
    {
      $sort: {
        name: -1,
      },
    },
  ];

  const products = await productCollection().aggregate(agg).toArray();
  // console.log(products, '<<< products')
  // const products = await productCollection().find().toArray()

  return products;
};

const findOneProductById = async (id) => {
  // const product = await productCollection().findOne({
  //   _id: new ObjectId(id)
  // })
  const agg = [
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "author.password": 0,
      },
    },
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
  ];
  const product = await productCollection().aggregate(agg).toArray();

  // console.log(product, '<<< product by id')
  return product[0];
};

const createProduct = async (payload) => {
  if (!payload.authorId) {
    // contoh validation`
    throw new GraphQLError("authorId is required", {
      extensions: {
        http: { status: 400 },
      },
    });
  }

  const newProduct = await productCollection().insertOne(payload);

  const dataProduct = await productCollection().findOne({
    _id: new ObjectId(newProduct.insertedId),
  });

  return dataProduct;
};

const addImageUrlToProduct = async (id, imgUrl) => {
  const updatedProduct = await productCollection().updateOne(
    { _id: new ObjectId(id) },
    {
      // $set: {
      //   imgUrl: imgUrl  // mengganti value jika ada field yg sama, tapi kalau ga ada, akan ditambahkan
      // }
      $push: {
        imgUrl: imgUrl, // menambahkan value ke dalam array imgUrl
      },
    }
  );

  const dataProduct = await productCollection().findOne({
    _id: new ObjectId(id),
  });

  return dataProduct;
};

const addOrder = async (productId, quantity, userId) => {
  const session = client.startSession();
  try {
    session.startTransaction();

    const product = await productCollection().findOne(
      {
        _id: new ObjectId(productId),
      },
      { session }
    );

    if (!product) {
      throw new GraphQLError("Product Not Found");
    }

    if (product.stock < quantity) {
      throw new GraphQLError("Out of stock");
    }

    const totalPrice = product.price * quantity;
    const payload = {
      productId: new ObjectId(product._id),
      userId: new ObjectId(userId),
      totalPrice,
      quantity,
    };

    const orderCollections = getDatabase().collection("orders");

    const newOrder = await orderCollections.insertOne(payload, { session });

    await productCollection().updateOne(
      {
        _id: new ObjectId(product._id),
      }, // param 1: filter
      {
        $set: { stock: product.stock - quantity },
      }, // param 2: payload update
      { session } // param 3: options
    );

    await session.commitTransaction();

    const order = await orderCollections.findOne({ _id: newOrder.insertedId });

    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  findAllProducts,
  findOneProductById,
  createProduct,
  addImageUrlToProduct,
  addOrder,
};
