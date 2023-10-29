import express from "express";
import checkAuth from "../middleware/check-auth.js";
import * as OrdersController from "../controllers/orders.js";
const router = express.Router();

router.get("/", checkAuth, OrdersController.orders_get_all);

router.post("/", checkAuth, OrdersController.orders_create_order);

router.get("/:orderId", checkAuth, OrdersController.orders_get_order);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

export default router;
