const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();

  res.send(products);
});

app.post("/products", async (req, res) => {
  const newProductData = req.body;

  const product = await prisma.product.create({
    data: {
      name: newProductData.name,
      price: newProductData.price,
      desc: newProductData.desc,
      image: newProductData.image,
    },
  });
  res.status(201).send({
    data: product,
    message: "Product created successfully",
  });
});

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, desc, image } = req.body;
  const product = await prisma.product.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      price,
      desc,
      image,
    },
  });
  res.send({
    data: product,
    message: "Product updated successfully",
  });
};

app.put("/products/:id", updateProduct);

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
  res.send({
    data: product,
    message: "Product deleted successfully",
  });
});

app.listen(PORT, () => {
  console.log("Express API Running in port :" + PORT);
});
