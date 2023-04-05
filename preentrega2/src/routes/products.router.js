import { Router, json } from "express";
import { ProductManager } from "../dao/index.js";

const productManager = new ProductManager("./products.json");
const productsRouter = Router();
productsRouter.use(json());

productsRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  const { stat, result } = await productManager.getProducts();

  if (stat === 400) {
    res.status(stat).send(result);
    return "";
  }

  if (!limit) {
    res.status(stat).send(result);
  } else {
    res.status(stat).send(result.slice(0, limit));
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const { stat, result } = await productManager.getProductById(pid);

  res.status(stat).send(result);
});

productsRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const newProduct = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  const { stat, result } = await productManager.addProduct(newProduct);
  if (stat === 200) {
    const resultComplete = await productManager.getProducts();
    req.io.emit("NewActionWithProduct", resultComplete.result);
    res.status(stat).send(result);
  } else {
    res.status(stat).send(result);
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const newProduct = {};
  if (title) {
    newProduct.title = title;
  }
  if (description) {
    newProduct.description = description;
  }
  if (code) {
    newProduct.title = code;
  }
  if (price) {
    newProduct.price = price;
  }
  if (status) {
    newProduct.status = status;
  }
  if (stock) {
    newProduct.stock = stock;
  }
  if (category) {
    newProduct.category = category;
  }
  if (thumbnails) {
    newProduct.thumbnails = thumbnails;
  }

  const { stat, result } = await productManager.updateProduct(pid, newProduct);
  if (stat === 200) {
    const resultComplete = await productManager.getProducts();
    req.io.emit("NewActionWithProduct", resultComplete.result);
  }
  res.status(stat).send(result);
});

productsRouter.delete("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const { stat, result } = await productManager.deleteProduct(pid);
  if (stat === 200) {
    const resultComplete = await productManager.getProducts();
    req.io.emit("NewActionWithProduct", resultComplete.result);
  }
  res.status(stat).send(result);
});

export default productsRouter;
