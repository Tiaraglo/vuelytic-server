const { GraphQLError } = require("graphql");
const { verifyToken } = require("./jwt");
const { findUserByUsername } = require("../models/user");

function createError(message, code) {
  let httpMsg = "INTERNAL SERVER ERROR";
  if (code === 400) httpMsg = "BAD REQUEST";
  return new GraphQLError(message, {
    extensions: {
      code: httpMsg,
      http: { status: code },
    },
  });
}

const authentication = async (req) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw createError("Invalid Token", 401);
  }

  const access_token = authorization.split(" ")[1];

  if (!access_token) {
    throw new createError("Invalid Token", 401);
  }

  const decodeToken = verifyToken(access_token);

  const user = await findUserByUsername(decodeToken.username);

  if (!user) {
    throw createError("Invalid User", 401);
  }

  return {
    userId: user._id,
    username: user.username,
  };
};

module.exports = { authentication };
