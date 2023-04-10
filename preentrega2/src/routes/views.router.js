import express from "express";
import { ProductManager, CartManager } from "../dao/index.js";
import ChatManager from "../dao/db-managers/chat.manager.js";

const viewRouter = express.Router();
const productManager = new ProductManager("./products.json");
const cartManager = new CartManager();
const chatManager = new ChatManager();

viewRouter.get("/", async (req, res) => {
  const {
    limit,
    page,
    sort,
    stock,
    title,
    description,
    code,
    price,
    status,
    category,
  } = req.query;
  const { stat, result } = await productManager.getFilteredProducts(
    limit,
    page,
    sort,
    stock,
    title,
    description,
    code,
    price,
    status,
    category
  );
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

viewRouter.get("/chat", async (req, res) => {
  try {
    const { stat, result } = await chatManager.getMessages();
    res.render("chat", { messages: result });
  } catch (error) {
    res.render("error");
  }
});

viewRouter.get("/products", async (req, res) => {
  try {
    const { stat, result } = await productManager.getProducts();
    res.render("products", { products: result });
  } catch (error) {
    res.render("error");
  }
});

viewRouter.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const { stat, result } = await cartManager.getCartById(cid);

    res.render("cart", { cart: result });
  } catch (error) {
    res.render("error");
  }
});

export default viewRouter;
