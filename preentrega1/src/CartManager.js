import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart(product) {
    const carts = await this.getCarts();
    let maxId = 0;
    if (carts.length) {
      maxId = carts[carts.length - 1].idCart + 1;
    }
    console.log(product.id);
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
      newCart.products = [newCart.products[0], { ...product[i], quantity: 1 }];
    }

    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    return newCart;
  }

  async addProduct(product) {
    const products = await this.getProducts();

    if (
      products.find((el) => {
        return el.code === product.code;
      })
    ) {
      console.error(`Code ${product.code} not valid`);
    } else {
      let maxId = 0;
      if (products.length) {
        maxId = products[products.length - 1].idCart + 1;
      }
      const newProduct = {
        ...product,
        idCart: maxId,
      };

      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return newProduct;
    }
  }

  async getCarts() {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    } else {
      return [];
    }
  }

  async getCartById(idCart) {
    const carts = await this.getCarts();
    const cart = carts.find((el) => {
      return el.idCart === idCart;
    });
    if (!cart) {
      return "Not found";
    } else {
      return cart;
    }
  }

  async updateProduct(idCart, newProduct) {
    const products = await this.getProducts();
    let position = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].idCart === idCart) {
        position = i;
      }
    }

    if (position === -1) {
      return "Not found";
    } else {
      products[position] = {
        ...products[position],
        ...newProduct,
        idCart: products[position].idCart,
      };

      await fs.promises.writeFile(this.path, JSON.stringify(products));
    }
  }

  async deleteProduct(idCart) {
    const products = await this.getProducts();
    let position = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].idCart === idCart) {
        position = i;
      }
    }

    if (position === -1) {
      return "Not found";
    } else {
      products.splice(position, 1);

      await fs.promises.writeFile(this.path, JSON.stringify(products));
    }
  }
}

export default CartManager;
