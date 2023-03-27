import cartModel from "../models/cart.model.js";
import ProductManager from "./product.manager.js";

class CartManager {
  constructor() {}

  async createCart(products) {
    try {
      const newCart = { products: [] };
      for (const prod of products) {
        newCart.products.push({ ...prod, quantity: 1 });
      }

      const result = await cartModel.create(newCart);
      return { stat: 200, result: result };
    } catch (error) {
      return { stat: 400, result: "Error - cart not created" };
    }
  }

  async getCarts() {
    try {
      const result = await cartModel.find().lean();
      return { stat: 200, result: result };
    } catch (error) {
      return { stat: 400, result: "Error trying to retrieve the carts" };
    }
  }

  async getCartById(idCart) {
    try {
      const result = await cartModel.findById(idCart);
      return { stat: 200, result: result };
    } catch (error) {
      return { stat: 400, result: [] };
    }
  }

  async addProduct(idCart, idProduct) {
    try {
      const cart = await cartModel.findById(idCart);
      let cant = 0;
      for (let index = 0; index < cart.products.length; index++) {
        if (cart.products[index].idProduct == idProduct) {
          cart.products[index].quantity = cart.products[index].quantity + 1;
          await cart.save();
          return { stat: 200, result: await cartModel.findById(idCart) };
        }
      }

      cart.products.push({ idProduct: idProduct, quantity: cant + 1 });
      await cart.save();
      return { stat: 200, result: await cartModel.findById(idCart) };
    } catch (error) {
      return { stat: 400, result: "Error tryind to retrieve the cart" };
    }
  }
}

export default CartManager;
