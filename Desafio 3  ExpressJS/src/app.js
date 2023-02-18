import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
app.use(express.json());

const productManager = new ProductManager("./Fiambres.json");

app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const product = await productManager.getProducts();
  if (!limit) {
    res.send(product);
  } else {
    res.send(product.slice(0, limit));
  }
});

app.get("/products/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = await productManager.getProducts();
  const prodEncontrado = product.find((el) => {
    return el.idProduct === pid;
  });

  if (prodEncontrado) {
    res.send(prodEncontrado);
  } else {
    res.send(["Producto no existente"]);
  }
});

app.listen(8080, () => {
  console.log("listening in 8082");
});
