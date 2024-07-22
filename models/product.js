const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");

const productCollection = () => {
  return getDatabase().collection('products')
}

const findAllProducts = async () => {
  const products = await productCollection().find().toArray()

  return products
}

const findOneProductById = async (id) => {
  const product = await productCollection().findOne({
    _id: new ObjectId(id)
  })

  return product
}

const createProduct = async (payload) => {
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