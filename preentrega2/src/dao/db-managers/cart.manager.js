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
      const result = await cartModel.findById(idCart).lean();
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
      return { stat: 400, result: "Error tryind to add product" };
    }
  }

  async deleteProduct(cid, pid) {
    try {
      const cart = await cartModel.findById(cid);
      let position = -1;
      for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].idProduct.equals(pid)) {
          position = i;
        }
      }

      if (position === -1) {
        return { stat: 400, result: "Product not found" };
      } else {
        cart.products.splice(position, 1);
        cart.save();
        return { stat: 200, result: cart };
      }
    } catch (error) {
      return { stat: 400, result: "Error deleting product" };
    }
  }

  async addQuantityToProduct(cid, pid, quantity) {
    try {
      const cart = await cartModel.findById(cid);
      let cant = 0;
      for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].idProduct == pid) {
          cart.products[i].quantity = cart.products[i].quantity + quantity;
          await cart.save();
          return { stat: 200, result: cart };
        }
      }
      return { stat: 400, result: "Product not found" };
    } catch (error) {
      return { stat: 400, result: "Error tryind to add more products" };
    }
  }

  async deleteCart(cid) {
    try {
      const result = await cartModel.deleteOne({ _id: cid });
      return { stat: 200, result: "Cart deleted correctly" };
    } catch (error) {
      return { stat: 400, result: "Error tryind to delete the cart" };
    }
  }
}

export default CartManager;
