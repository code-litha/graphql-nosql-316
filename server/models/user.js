const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");
const { hashPassword } = require("../utils/bcrypt");

const getCollection = () => {
  const db = getDatabase();
  const userCollection = db.collection("users");
  return userCollection;
};

const createUser = async (payload) => {
  payload.password = hashPassword(payload.password);

  const collection = getCollection();
  const newUser = await collection.insertOne(payload);

  const user = await collection.findOne(
    {
      _id: newUser.insertedId,
    },
    {
      projection: { // untuk melakukan seleksi terhadap field yg mau di return
        password: 0,  // kalau value 0, maka disebut dengan exclude
      },
    }
  );

  // console.log(user, '<<< user')

  return user;
};

const findAllUser = async () => {
  const users = await getCollection()
    .find(
      {},
      {
        projection: {
          password: 0,
        },
      }
    )
    .toArray();

  return users;
};

const findUserByEmail = async (email = "") => {
  const user = await getCollection().findOne({ email });

  return user;
};

const findUserById = async (id = "") => {
  const user = await getCollection().findOne({ _id: new ObjectId(id) });

  return user;
};

module.exports = {
  createUser,
  findAllUser,
  findUserByEmail,
  findUserById,
};
