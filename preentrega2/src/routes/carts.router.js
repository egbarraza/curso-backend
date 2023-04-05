import { Router, json } from "express";
import { ProductManager, CartManager } from "../dao/index.js";

const cartsRouter = Router();
cartsRouter.use(json());

const cartManager = new CartManager("./files/carts.json");
const productManager = new ProductManager("./files/products.json");

cartsRouter.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const { stat, result } = await cartManager.getCartById(cid);
  res.status(stat).send(result);
});

cartsRouter.post("/", async (req, res) => {
  const products = req.body;
  const resultado = await cartManager.createCart(products);

  const { stat, result } = await productManager.getProducts();
  res.render("products", { products: result });

  //res.status(stat).send(result);
});

cartsRouter.post("/addProduct", async (req, res) => {
  const { idProduct } = req.body;
  const newProduct = [{ idProduct: idProduct }];
  const { stat, result } = await cartManager.createCart(newProduct);

  res.status(stat).send(result);
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const { stat, result } = await cartManager.addProduct(cid, pid);

  res.status(stat).send(result);
});

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const { stat, result } = await cartManager.deleteProduct(cid, pid);
  res.status(stat).send(result);
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const { quantity } = req.body;

  const { stat, result } = await cartManager.addQuantityToProduct(
    cid,
    pid,
    quantity
  );
  res.status(stat).send(result);
});

cartsRouter.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;

  const { stat, result } = await cartManager.deleteCart(cid);
  res.status(stat).send(result);
});

export default cartsRouter;
