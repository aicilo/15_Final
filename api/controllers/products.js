import mongoose from "mongoose";
import Product from "../models/product.js";

const products_get_all = async (req, res, next) => {
  try {
    const products = await Product.find()
      .select("name price productImage")
      .exec();
    const response = {
      count: products.length,
      products: products.map((product) => {
        return {
          name: product.name,
          price: product.price,
          productImage: `http://localhost:3000/${product.productImage}`,
          _id: product._id,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${product._id}`,
          },
        };
      }),
    };
    console.log(process.env.HOSTNAME);
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.json({ error: error.message });
  }
};

const products_create_product = async (req, res, next) => {
  console.log(req.file);
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
    });
    const saveProduct = await product.save();
    const result = {
      message: "Created product successfully",
      createdProduct: {
        name: saveProduct.name,
        price: saveProduct.price,
        _id: saveProduct._id,
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${saveProduct._id}`,
        },
      },
    };
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const products_get_product = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const product = await Product.findById(id).exec();
    const result = {
      name: product.name,
      price: product.price,
      productImage: `http://localhost:3000/${product.productImage}`,
      _id: product._id,
      request: {
        type: "GET",
        url: `http://localhost:3000/products/${product._id}`,
      },
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "something went wrong" });
  }
};

const products_update_product = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    const result = {
      message: "Product updated",
      updatedProduct: {
        name: updateProduct.name,
        price: updateProduct.price,
        _id: updateProduct._id,
      },
      request: {
        type: "GET",
        url: `http://localhost:3000/products/${updateProduct._id}`,
      },
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(304).json({ error: "something went wrong" });
  }
};

const products_delete_product = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const deleteProduct = await Product.deleteOne({ _id: id }).exec();
    const result = {
      message: "Product deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/products",
        body: {
          name: "String",
          price: "Number",
        },
      },
    };
    res.status(202).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export {
  products_get_all,
  products_create_product,
  products_get_product,
  products_update_product,
  products_delete_product,
};
