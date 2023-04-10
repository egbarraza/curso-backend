import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        idProduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: { type: Number },
      },
    ],
    required: true,
  },
});

// Agregado de middleware
/*cartSchema.pre("findById", function () {
  this.populate("products.idProduct");
});*/

const cartModel = mongoose.model("carts", cartSchema);
export default cartModel;
