import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";

const app = express();

app.use(express.static(__dirname + "/../public"));

app.use("/products", productsRouter);

app.use("/carts", cartsRouter);

app.listen(8082, () => {
  console.log("Server listening on port 8080");
});
