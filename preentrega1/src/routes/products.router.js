import { Router, json } from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager("./products.json");
const productsRouter = Router();
productsRouter.use(json());

productsRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  const product = await productManager.getProducts();
  if (!limit) {
    res.send(product);
  } else {
    res.send(product.slice(0, limit));
  }
  req.body;
});

productsRouter.get("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = await productManager.getProductById(pid);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send("Not found");
  }
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

  const result = await productManager.addProduct(newProduct);
  if (result === "") {
    res.status(200).send(newProduct);
  } else {
    res.status(404).send(newProduct);
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
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

  await productManager.updateProduct(pid, newProduct);

  res.status(200).send(await productManager.getProductById(pid));
});

productsRouter.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  await productManager.deleteProduct(pid);
  res.status(200).send("Eliminado exitosamente");
});

export default productsRouter;
