import express from "express";
import UserManager from "../dao/db-managers/user.manager.js";
import { ProductManager } from "../dao/index.js";

const sessionsRouter = express.Router();
const userManager = new UserManager();
const productManager = new ProductManager();

sessionsRouter.get("/login", async (req, res) => {
  const { user, password } = req.body;
  try {
    const { stat, result } = await userManager.validUser(user, password);
    if (stat === 200) {
      req.session.user = result;

      //console.log(req.session.user);
      /*
      console.log({ user: req.session.user });
      console.log(typeof req.session.user);
      res.render("login", { user: req.session.user });
      */
      const response = { payload: null };
      const resultProducts = await productManager.getProducts();

      response.payload = resultProducts.result;
      console.log(response.payload);
      res.render("homeProducts", { result: response });
    } else {
      res.render("login", { result: { message: result } });
    }
  } catch (error) {
    res.render("error", {});
  }
});

sessionsRouter.post("/register", async (req, res) => {
  const { first_name, last_name, age, user, password } = req.body;
  try {
    const newUser = {
      first_name,
      last_name,
      age,
      user,
      password,
    };
    const { stat, result } = await userManager.addUser(newUser);
    if (stat === 200) {
      req.session.user = newUser;

      const response = { payload: null };
      const resultProducts = await productManager.getProducts();

      response.payload = resultProducts.result;
      res.render("login", { user: req.session.user });
    } else {
      res.render("login", result);
    }
  } catch (error) {
    return null;
  }
});

export default sessionsRouter;
