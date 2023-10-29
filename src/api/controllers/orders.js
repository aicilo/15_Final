import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/product.js";

const orders_get_all = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .select("_id productId quantity")
      .populate("productId", ["name", "price"]);
    const result = {
      count: orders.length,
      orders: orders.map((order) => {
        return {
          _id: order._id,
          product: order.productId,
          quantity: order.quantity,
          request: {
            type: "GET",
            url: `http://localhost:3000/orders/${order._id}`,
          },
        };
      }),
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const orders_create_order = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const searchProduct = await Product.findById({ _id: productId });
    if (searchProduct) {
      try {
        const newOrder = new Order({
          _id: new mongoose.Types.ObjectId(),
          productId: req.body.productId,
          quantity: req.body.quantity,
        });

        const saveOrder = await newOrder.save();
        const result = {
          message: "Order stored",
          createOrder: {
            _id: saveOrder._id,
            productId: saveOrder.productId,
            productName: searchProduct.name,
            productPrice: searchProduct.price,
            quantity: saveOrder.quantity,
            total: Number(searchProduct.price) * Number(saveOrder.quantity),
          },
          response: {
            type: "GET",
            url: `http://localhost:3000/orders/${saveOrder._id}`,
          },
        };
        res.status(201).json(result);
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "something went wrong" });
      }
    } else {
      res.status(404).json({
        message: "Product not found!",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "something went wrong" });
  }
};

const orders_get_order = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const searchOrder = await Order.findById({ _id: orderId }).populate(
      "productId",
      ["name", "price"]
    );
    const result = {
      _id: searchOrder._id,
      productId: searchOrder.productId,
      quantity: searchOrder.quantity,
      request: {
        type: "GET",
        url: "http://localhost:3000/orders",
      },
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      message: "Order not found",
    });
  }
};

const orders_delete_order = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const deleteOrder = await Order.findByIdAndRemove({ _id: orderId });
    if (deleteOrder) {
      const result = {
        message: "Order deleted",
        response: {
          type: "GET",
          url: "http://localhost:3000/orders",
          body: {
            productId: "ID",
            quantity: "Number",
          },
        },
      };
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "something went wrong" });
  }
};

export {
  orders_get_all,
  orders_create_order,
  orders_get_order,
  orders_delete_order,
};
