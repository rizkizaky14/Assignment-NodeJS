const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();

dotenv.config();
const PORT = process.env.PORT;
app.use(bodyParser.json());
// app.use(express.json());

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

const updateProductHandler = async (req, res, requireAllFields) => {
  const { id } = req.params;
  const { name, price, desc, image } = req.body;

  if (requireAllFields && (!name || !price || !desc || !image)) {
    res.status(400).send({
      message: "Missing required fields",
    });
    return;
  }

  try {
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
  } catch (error) {
    res.status(500).send({
      message: "Error updating product",
      error: error.message,
    });
  }
};

const updateProduct = (req, res) => {
  updateProductHandler(req, res, true);
};

const patchProduct = (req, res) => {
  updateProductHandler(req, res, false);
};
app.put("/products/:id", updateProduct);
app.patch("/products/:id", patchProduct);

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
