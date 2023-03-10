import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewRouter from "./routes/views.router.js";

const app = express();
app.use(urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());

const httpServer = app.listen(8082, () => {
  console.log("Server listening on port 8080");
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected.");
});

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/", viewRouter);

io.on("messge", (value) => {
  console, log(value);
});
