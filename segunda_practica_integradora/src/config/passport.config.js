import passport from "passport";
import LocalStrategy from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

export const initializePassport = () => {
  passport.use(
    "registerStrategy",
    new LocalStrategy(
      {
        usernameField: "user",
        passReqToCallback: true,
      },

      async (req, username, password, done) => {
        console.log("ACA3");
        const { first_name, last_name, age } = req.body;

        try {
          console.log("VA  a BUSCAR");
          const userObject = await userModel.findOne({ user: username }).lean();
          console.log("No encontro USER");
          if (userObject) {
            return done(null, false);
          }
          let rol = "user";
          if (
            username === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            rol = "admin";
          }

          const newUser = {
            first_name,
            last_name,
            age,
            user: username,
            password: createHash(password),
            rol,
          };
          console.log("VA  a CREAR");
          const createdUser = await userModel.create(newUser);
          console.log("CREO");
          return done(null, createdUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "loginStrategy",
    new LocalStrategy(
      {
        usernameField: "user",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ user: username });
          if (!user) {
            return done(null, false);
          }
          //usuario existe, validar contraseña
          console.log("/**********/");
          console.log(password);
          console.log("/**********/");
          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("ACA");
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("ACA2");
    const user = await userModel.findById(id);
    return done(null, user);
  });
};
