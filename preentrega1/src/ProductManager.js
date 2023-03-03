import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    const products = await this.getProducts();

    if (
      products.find((el) => {
        return el.code === product.code;
      })
    ) {
      return `Code ${product.code} not valid`;
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
      return "";
    }
  }

  async getProducts() {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    } else {
      return [];
    }
  }

  async getProductById(idProduct) {
    const products = await this.getProducts();
    const product = products.find((el) => {
      return el.idProduct === idProduct;
    });
    if (!product) {
      return [];
    } else {
      return product;
    }
  }

  async updateProduct(idProduct, newProduct) {
    const products = await this.getProducts();
    let position = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].idProduct === idProduct) {
        position = i;
      }
    }

    if (position === -1) {
      return "Not found";
    } else {
      products[position] = {
        ...products[position],
        ...newProduct,
        idProduct: products[position].idProduct,
      };

      await fs.promises.writeFile(this.path, JSON.stringify(products));
    }
  }

  async deleteProduct(idProduct) {
    const products = await this.getProducts();
    let position = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].idProduct === idProduct) {
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

export default ProductManager;
