import { Router, json } from "express";
import ProductManager from "../ProductManager.js";
import CartManager from "../CartManager.js";

const cartsRouter = Router();
cartsRouter.use(json());

const cartManager = new CartManager("./carts.json");
const productManager = new ProductManager("./products.json");

cartsRouter.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const carts = await cartManager.getCarts();
  const cartEncontrado = carts.find((el) => {
    return el.idCart === cid;
  });

  if (cartEncontrado) {
    res.status(200).send(cartEncontrado);
  } else {
    res.status(404).send(["Carrito no existente"]);
  }
});

cartsRouter.post("/", async (req, res) => {
  const products = req.body;
  const result = await cartManager.createCart(products);

  res.status(200).send(result);
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const cart = await cartManager.getCartById(cid);

  if (cart) {
    const product = await productManager.getProductById(pid);
    if (product) {
      let habia = false;
      for (const prod of cart.products) {
        if (prod.id === product.idProduct) {
          habia = true;
          prod.quantity = prod.quantity + 1;
        }
      }

      if (!habia) {
        cart.products.push({ id: pid, quantity: 1 });
      } else {
        res.status(404).send(["Producto no existente"]);
      }
    } else {
      res.status(404).send(["Carrito no existente"]);
    }
  }
});

export default cartsRouter;
