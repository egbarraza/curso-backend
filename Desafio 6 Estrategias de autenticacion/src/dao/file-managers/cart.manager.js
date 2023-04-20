import fs from "fs";
import ProductManager from "./product.manager.js";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart(product) {
    try {
      const { stat, result } = await this.getCarts();
      const carts = result;
      if (stat === 200) {
        let maxId = 0;
        if (carts.length) {
          maxId = carts[carts.length - 1].idCart + 1;
        }

        const newCart = {
          idCart: maxId,
          products: [
            {
              id: product[0].id,
              quantity: 1,
            },
          ],
        };

        for (let i = 1; i < product.length; i++) {
          newCart.products.push({ ...product[i], quantity: 1 });
        }

        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return { stat: 200, result: newCart };
      } else {
        return { stat: 200, result: carts };
      }
    } catch (error) {
      return { stat: 400, result: "Error - cart not created" };
    }
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        return {
          stat: 200,
          result: JSON.parse(await fs.promises.readFile(this.path, "utf-8")),
        };
      } else {
        return { stat: 200, result: [] };
      }
    } catch (error) {
      return { stat: 400, result: "Error trying to retrieve the carts" };
    }
  }

  async getCartById(idCart) {
    try {
      const { stat, result } = await this.getCarts();
      if (stat === 400) {
        return { stat: stat, result: result };
      }

      const carts = result;
      const cart = carts.find((el) => {
        return el.idCart === idCart;
      });
      if (!cart) {
        return { stat: 400, result: [] };
      } else {
        return { stat: 200, result: cart };
      }
    } catch (error) {
      return { stat: 400, result: [] };
    }
  }

  async addProduct(idCart, idProduct) {
    try {
      const productManager = new ProductManager("./products.json");
      const resultComplete = await productManager.getProductById(idProduct);
      const statProduct = resultComplete.stat;

      const { stat, result } = await this.getCarts();
      const carts = result;

      if (statProduct === 200 && stat === 200) {
        let existCart = false;
        let existProduct = false;

        for (let i = 0; i < carts.length; i++) {
          if (carts[i].idCart === idCart) {
            //Encontre el carrito que me pasaron
            //Ahora recorro los productos de ese carrito para ver si tiene agregado mi producto
            existCart = true;
            for (let j = 0; j < carts[i].products.length; j++) {
              if (carts[i].products[j].id === idProduct) {
                //Encontre mi producto agregado, le sumo 1 a la cantidad
                existProduct = true;
                carts[i].products[j].quantity =
                  carts[i].products[j].quantity + 1;
                break;
              }
            }

            if (!existProduct) {
              //No encontre el producto en mi carrito, lo creo con cantidad 1
              carts[i].products.push({ id: idProduct, quantity: 1 });
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return { stat: 200, result: carts[i] };
            break;
          }
        }

        if (!existCart) {
          return { stat: 400, result: "Cart doesn't exist" };
        }
      } else {
        return { stat: 400, result: "Cart or product don't exist" };
      }
    } catch (error) {
      return { stat: 400, result: "Error tryind to retrieve the cart" };
    }
  }
}

export default CartManager;
