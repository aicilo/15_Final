import mongoose from "mongoose";

// const productSchema = mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   name: String,
//   price: Number,
// });

const productSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
});

// module.exports = mongoose.model("Product", productSchema);
export default mongoose.model("Product", productSchema);
