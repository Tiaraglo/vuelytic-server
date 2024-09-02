const { GraphQLError } = require("graphql");
const { comparePassword } = require("../utils/bcrypt");
const { signToken } = require("../utils/jwt");
const {
  addUser,
  findUserByUsername,
  findUserByEmail,
} = require("../models/user");

const typeDefs = `#graphql

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String
    }

    type UserLogin {
        _id: ID!
        username: String!
        email: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    input AddUserInput {
        name: String!
        username: String!
        email: String!
        password: String!
    }

    type Query {
        getUser(email: String) : UsersResponse
    }

    type Mutation {
      register(input: AddUserInput): UserRegisterResponse
      login(input: LoginInput) : UserLoginResponse
    }
`;

const resolvers = {
  Query: {
    getUser: async (_parent, args) => {
      const { email } = args;

      const user = await findUserByEmail(email);

      return {
        statusCode: 200,
        message: "Success get user",
        data: user,
      };
    },
  },
  Mutation: {
    register: async (_parent, args) => {
      const { name, username, email, password } = args.input;

      const existingUsername = await findUserByUsername(username);
      if (existingUsername) {
        throw new GraphQLError("Username must be unique", {
          extensions: {
            http: {
              status: 400,
            },
          },
        });
      }

      const existingEmail = await findUserByEmail(email);
      if (existingEmail) {
        throw new GraphQLError("Email must be unique", {
          extensions: {
            http: {
              status: 400,
            },
          },
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new GraphQLError("Invalid email format", {
          extensions: {
            http: {
              status: 400,
            },
          },
        });
      }

      if (password.length < 5) {
        throw new GraphQLError(
          "Minimum password length should be 5 characters",
          {
            extensions: {
              http: {
                status: 400,
              },
            },
          }
        );
      }

      const dataUser = await addUser({
        name,
        username,
        email,
        password,
      });

      return {
        statusCode: 201,
        message: "User successfully registered",
        data: dataUser,
      };
    },
    login: async (_parent, args) => {
      const { username, password } = args.input;

      const userLogin = await findUserByUsername(username);

      // console.log(userLogin, "here the user data");

      if (!userLogin) {
        throw new GraphQLError("Invalid username or password", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const isPasswordMatch = comparePassword(password, userLogin.password);

      if (!isPasswordMatch) {
        throw new GraphQLError("Invalid username or password", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const payload = {
        id: userLogin._id,
        email: userLogin.email,
        username: userLogin.username,
      };

      const id = userLogin._id.toString();

      const access_token = signToken(payload);

      return {
        statusCode: 200,
        message: "Login Success",
        data: {
          id,
          username: userLogin.username,
          access_token,
        },
      };
    },
  },
};

module.exports = {
  userTypeDefs: typeDefs,
  userResolvers: resolvers,
};
