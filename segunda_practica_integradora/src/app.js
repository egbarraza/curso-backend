import express, { urlencoded } from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import passport from "passport";
import MongoStore from "connect-mongo";
import { initializePassport } from "./config/passport.config.js";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import ChatManager from "./dao/db-managers/chat.manager.js";

const chatManager = new ChatManager();
const app = express();

app.use(urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

const httpServer = app.listen(8082, () => {
  console.log("Server listening on port 8080");
});

mongoose
  .connect(
    "mongodb+srv://admin:admin@coderbase.ssj68go.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then((conn) => {
    console.log("Connected to DB!");
  });

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://admin:admin@coderbase.ssj68go.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 10000,
    }),
    secret: "claveSecreta",
    resave: true,
    saveUninitialized: true,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected.");

  socket.on("new-message", async (data) => {
    const { stat, result } = await chatManager.newMessage(data);
    //mando result.result porque lo recibe asi desde el find()
    io.emit("messages", result.result);
  });
});

//midle para recibir io desde el router
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewRouter);
app.use("/api/sessions", sessionsRouter);
