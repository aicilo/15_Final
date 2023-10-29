import express from "express";
import productRoutes from "./api/routes/product.js";
import orderRoutes from "./api/routes/orders.js";
import userRoutes from "./api/routes/user.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

const app = express();

dotenv.config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@node-rest-shop.bisrgce.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(morgan("dev"));

// app.use(express.static("uploads"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");

    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((req, res, next) => {
  res.sendStatus(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
export default app;
