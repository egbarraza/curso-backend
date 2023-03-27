import productModel from "../models/product.model.js";

class ProductManager {
  constructor() {}

  async addProduct(product) {
    try {
      const result = await productModel.create(product);
      return { stat: 200, result: result };
    } catch (error) {
      return { stat: 400, result: "Error" };
    }
  }

  async getProducts() {
    try {
      const result = await productModel.find().lean();
      return { stat: 200, result: result };
    } catch (error) {
      return { stat: 400, result: "Error trying to retrieve the products" };
    }
  }

  async getProductById(idProduct) {
    try {
      const result = await productModel.findById(idProduct);
      return { stat: 200, result: result };
    } catch (error) {
      return { stat: 200, result: product };
    }
  }

  async updateProduct(idProduct, newProduct) {
    try {
      const updatedProduct = await productModel.findOneAndUpdate(
        { _id: idProduct },
        newProduct,
        { new: true }
      );
      return { stat: 200, result: updatedProduct };
    } catch (error) {
      return { stat: 400, result: "Error updating product" + " - " + error };
    }
  }

  async deleteProduct(idProduct) {
    try {
      const result = await productModel.deleteOne({ _id: idProduct });
      return { stat: 200, result: result };
    } catch (error) {
      return { stat: 400, result: "Error deleting product" };
    }
  }
}

export default ProductManager;
