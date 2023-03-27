import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
      const { stat, result } = await this.getProducts();
      const products = result;
      if (
        products.find((el) => {
          return el.code === product.code;
        })
      ) {
        return { stat: 400, result: `Code ${product.code} not valid` };
      } else {
        let maxId = 1;
        if (products.length) {
          maxId = products[products.length - 1].idProduct + 1;
        }
        const newProduct = {
          ...product,
          idProduct: maxId,
        };

        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return { stat: 200, result: "" };
      }
    } catch (error) {
      return { stat: 400, result: "Error" };
    }
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const result = JSON.parse(
          await fs.promises.readFile(this.path, "utf-8")
        );
        return {
          stat: 200,
          result: result,
        };
      } else {
        return { stat: 200, result: [] };
      }
    } catch (error) {
      return { stat: 400, result: "Error trying to retrieve the products" };
    }
  }

  async getProductById(idProduct) {
    const { stat, result } = await this.getProducts();
    const products = result;
    if (stat === 400) {
      return { stat: 400, result: products };
    }

    const product = products.find((el) => {
      return el.idProduct === idProduct;
    });
    if (!product) {
      return { stat: 400, result: "Product not found" };
    } else {
      return { stat: 200, result: product };
    }
  }

  async updateProduct(idProduct, newProduct) {
    try {
      const { stat, result } = await this.getProducts();
      const products = result;
      if (stat === 400) {
        return { stat: 400, result: products };
      }

      let position = -1;
      for (let i = 0; i < products.length; i++) {
        if (products[i].idProduct === idProduct) {
          position = i;
        }
      }

      if (position === -1) {
        return { stat: 400, result: "Product not found" };
      } else {
        products[position] = {
          ...products[position],
          ...newProduct,
          idProduct: products[position].idProduct,
        };

        await fs.promises.writeFile(this.path, JSON.stringify(products));

        return { stat: 200, result: products[position] };
      }
    } catch (error) {
      return { stat: 400, result: "Error updating product" };
    }
  }

  async deleteProduct(idProduct) {
    try {
      const { stat, result } = await this.getProducts();
      const products = result;
      if (stat === 400) {
        return { stat: 400, result: products };
      }

      let position = -1;
      for (let i = 0; i < products.length; i++) {
        if (products[i].idProduct === idProduct) {
          position = i;
        }
      }

      if (position === -1) {
        return { stat: 400, result: "Product not found" };
      } else {
        products.splice(position, 1);

        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return { stat: 200, result: "Product deleted correctly" };
      }
    } catch (error) {
      return { stat: 400, result: "Error deleting product" };
    }
  }
}

export default ProductManager;
