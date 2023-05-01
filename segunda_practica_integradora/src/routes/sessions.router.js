import express from "express";
import passport from "passport";
import UserManager from "../dao/db-managers/user.manager.js";
import { createHash, isValidPassword } from "../utils.js";

const sessionsRouter = express.Router();
const userManager = new UserManager();

// sessionsRouter.post("/login", async (req, res) => {
//   const { user, password } = req.body;
//   try {
//     const { stat, result } = await userManager.getUser(user);
//     if (stat === 200) {
//       if (!isValidPassword(user, password)) {
//         res.redirect("/homeProducts");
//       }
//     } else {
//       res.render("login", { result: { message: result } });
//     }
//   } catch (error) {
//     res.render("error", {});
//   }
// });

sessionsRouter.post(
  "/login",
  passport.authenticate("loginStrategy", {
    failureRedirect: "/api/sessions/failure-login",
  }),
  (req, res) => {
    res.redirect("/products");
  }
);

sessionsRouter.get("/failure-login", (req, res) => {
  res.send(
    `<div>Error al loguear al usuario, <a href="/login">Intente de nuevo</a></div>`
  );
});

// sessionsRouter.post("/register", passport.autenticate, async (req, res) => {
//   const { first_name, last_name, age, user, password } = req.body;
//   try {
//     const newUser = {
//       first_name,
//       last_name,
//       age,
//       user,
//       password: createHash(password),
//     };
//     const { stat, result } = await userManager.addUser(newUser);
//     if (stat === 200) {
//       req.session.user = newUser;
//       res.render("login", { user: req.session.user });
//     } else {
//       res.render("login", result);
//     }
//   } catch (error) {
//     return null;
//   }
// });

sessionsRouter.post(
  "/register",
  passport.authenticate("registerStrategy", {
    failureRedirect: "/failure-signup",
  }),
  async (req, res) => {
    res.redirect("/products");
  }
);

sessionsRouter.get("/failure-signup", (req, res) => {
  res.send("No fue posible registrar el usuario");
});

sessionsRouter.get("/current", async (req, res) => {
  if (req.user) {
    return res.send({ userInfo: req.user });
  }
  res.send("Usuario No Logueado");
});

sessionsRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.json({
        status: "error",
        message: "no se pudo cerrar la sesión",
      });
    res.json({ status: "success", message: "sesion finalizada" });
  });
});

export default sessionsRouter;
