const { ObjectId } = require("mongodb");
const { hashPassword } = require("../utils/bcrypt");
const { getDatabase } = require("../config/mongoConnection");

const userCollection = () => {
  return getDatabase().collection("Users");
};

const addUser = async (payload) => {
  payload.password = hashPassword(payload.password);
  const newUser = await userCollection().insertOne(payload);

  const dataUser = await userCollection().findOne(
    {
      _id: new ObjectId(newUser.insertedId),
    },
    {
      projection: {
        password: 0,
      },
    }
  );

  return dataUser;
};

const findUserByEmail = async (email) => {
  const user = await userCollection().findOne({ email });
  return user;
};

const findUserByUsername = async (username) => {
  const user = await userCollection().findOne({ username });
  return user;
};

module.exports = {
  addUser,
  findUserByEmail,
  findUserByUsername,
};
