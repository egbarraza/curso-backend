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

  async getFilteredProducts(
    limit,
    page,
    sort,
    stock,
    title,
    description,
    code,
    price,
    status,
    category
  ) {
    try {
      let myMatch = {};
      let orden = false;
      let filtro = false;

      if (!sort) {
        orden = false;
      } else if (sort === "desc") {
        orden = { price: -1 };
      } else if (sort === "asc") {
        orden = { price: 1 };
      }
      if (title) {
        myMatch["title"] = { $eq: title };
        filtro = true;
      }
      if (description) {
        myMatch["description"] = { $eq: title };
      }
      if (code) {
        myMatch["code"] = { $eq: code };
        filtro = true;
      }
      if (price) {
        myMatch["code"] = { $eq: price };
        filtro = true;
      }
      if (status) {
        myMatch["status"] = { $eq: status };
        filtro = true;
      }
      if (stock) {
        myMatch["stock"] = { $eq: stock };
        filtro = true;
      }
      if (category) {
        myMatch["category"] = { $eq: category };
        filtro = true;
      }

      let paginate;
      if (!filtro) {
        paginate = await productModel.paginate(
          {},
          {
            limit: limit ?? 10,
            lean: true,
            page: page ?? 1,
            sort: orden,
          }
        );
      } else {
        paginate = await productModel.paginate(
          { ...myMatch },
          {
            limit: limit ?? 10,
            lean: true,
            page: page ?? 1,
            sort: orden,
          }
        );
      }

      const result = {
        status: "success",
        payload: paginate.docs,
        totalPages: paginate.totalPages,
        prevPage: paginate.prevPage,
        nextPage: paginate.nextPage,
        page: paginate.page,
        hasPrevPage: paginate.hasPrevPage,
        hasNextPage: paginate.hasNextPage,
        prevLink: null,
        nextLink: null,
      };

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
