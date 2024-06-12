const prisma = require("../db");

const getAllProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};

const getProductById = async (id) => {
  if (typeof id !== "number") {
    throw Error("ID must be a number");
  }
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) {
    throw Error("Product not found");
  }
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
};
