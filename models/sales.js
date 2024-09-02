const { getDatabase } = require("../config/mongoConnection");

const salesCollection = () => {
  return getDatabase().collection("Sales");
};

const fetchSales = async () => {
  const sales = await salesCollection().find().toArray();

  // console.log(sales, "here's sales");

  return sales;
};

module.exports = { fetchSales };
