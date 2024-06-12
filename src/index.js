const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
const PORT = process.env.PORT;
app.use(bodyParser.json());

const productController = require("./products/product.controller");
app.use("/products", productController);

app.listen(PORT, () => {
  console.log("Express API Running in port :" + PORT);
});
