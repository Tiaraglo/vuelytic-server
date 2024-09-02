const responseTypeDefs = `#graphql
  interface Response {
    statusCode: String!
    message: String
    error: String
  }

  type UserLoginData {
    id: ID!
    username: String
    access_token: String
  }

  type UserLoginResponse implements Response {
    statusCode: String!
    message: String
    error: String
    data: UserLoginData
  }

  type UserRegisterResponse implements Response {
    statusCode: String!
    message: String
    error: String
    data: User
  }

  type UsersResponse implements Response {
    statusCode: String!
    message: String
    error: String
    data: UserLogin
  } 


  type FetchSales implements Response {
    statusCode: String!
    message: String
    error: String
    data: [Sales]
  } 
  `;

module.exports = { responseTypeDefs };
