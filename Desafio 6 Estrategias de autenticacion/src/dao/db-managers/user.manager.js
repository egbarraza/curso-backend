import userModel from "../models/user.model.js";

class UserManager {
  constructor() {}

  async validUser(user, password) {
    try {
      const result = await userModel.findOne({
        user: user,
        password: password,
      });
      if (!result) {
        return { stat: 400, result: "Error- Invalid user or password" };
      }

      return { stat: 200, result: result };
    } catch (error) {
      return false;
    }
  }

  async addUser(user) {
    try {
      const result = await userModel.create(user);

      return { stat: 200, result: true };
    } catch (error) {
      return { stat: 400, result: "Error trying register new user" };
    }
  }
}

export default UserManager;
