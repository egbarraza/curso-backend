import express from "express";
import ProductManager from "../ProductManager.js";

const viewRouter = express.Router();
const productManager = new ProductManager("./products.json");

viewRouter.get("/", async (req, res) => {
  const { stat, result } = await productManager.getProducts();
  if (stat === 400) {
    res.render("error");
  } else {
    res.render("home", { products: result });
  }
});

viewRouter.get("/real-time-products", async (req, res) => {
  const { stat, result } = await productManager.getProducts();
  if (stat === 400) {
    res.render("error");
  } else {
    res.render("real_time_products", { products: result });
  }
});

export default viewRouter;
