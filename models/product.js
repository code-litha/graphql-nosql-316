const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");
const { GraphQLError } = require("graphql");

const productCollection = () => {
  return getDatabase().collection('products')
}

const findAllProducts = async () => {
  const agg = [
    {
      '$lookup': {
        'from': 'users', 
        'localField': 'authorId', 
        'foreignField': '_id', 
        'as': 'author'
      }
    }, {
      '$unwind': {
        'path': '$author', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'author.password': 0
      }
    }, {
      '$sort': {
        'name': -1
      }
    }
  ];

  const products = await productCollection().aggregate(agg).toArray()
  // console.log(products, '<<< products')
  // const products = await productCollection().find().toArray()

  return products
}

const findOneProductById = async (id) => {
  // const product = await productCollection().findOne({
  //   _id: new ObjectId(id)
  // })
  const agg = [
    {
      '$lookup': {
        'from': 'users', 
        'localField': 'authorId', 
        'foreignField': '_id', 
        'as': 'author'
      }
    }, {
      '$unwind': {
        'path': '$author', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'author.password': 0
      }
    }, {
      '$match': {
        '_id': new ObjectId(id)
      }
    }
  ];
  const product = await productCollection().aggregate(agg).toArray()

  // console.log(product, '<<< product by id')
  return product[0]
}

const createProduct = async (payload) => {
  if (!payload.authorId) {  // contoh validation`
    throw new GraphQLError('authorId is required', {
      extensions: {
        http: { status: 400 }
      }
    })
  }

  const newProduct = await productCollection().insertOne(payload)

  const dataProduct = await productCollection().findOne({
    _id: new ObjectId(newProduct.insertedId)
  })

  return dataProduct
}

const addImageUrlToProduct = async (id, imgUrl) => {
  const updatedProduct = await productCollection().updateOne(
    { _id: new ObjectId(id) },
    { 
      // $set: {
      //   imgUrl: imgUrl  // mengganti value jika ada field yg sama, tapi kalau ga ada, akan ditambahkan
      // }
      $push : {
        imgUrl: imgUrl   // menambahkan value ke dalam array imgUrl
      }
    }
  )

  const dataProduct = await productCollection().findOne({
    _id: new ObjectId(id)
  })

  return dataProduct
}


module.exports = {
  findAllProducts,
  findOneProductById,
  createProduct,
  addImageUrlToProduct
}