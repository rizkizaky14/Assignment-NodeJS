const express = require("express");
const prisma = require("../db");
const router = express.Router();
const { getAllProducts, getProductById } = require("./product.service");

router.get("/", async (req, res) => {
  const products = await getAllProducts();

  res.send(products);
});

router.get("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await getProductById(productId);
    res.send(product);
  } catch (error) {
    res.status(500).send({
      message: "id product not found",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
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
router.put("/:id", updateProduct);
router.patch("/:id", patchProduct);

router.delete("/:id", async (req, res) => {
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

module.exports = router;
