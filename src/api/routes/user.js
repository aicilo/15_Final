import express from "express";
import chechAuth from "../middleware/check-auth.js";
import * as UserController from "../controllers/user.js";

const router = express.Router();

router.post("/signup", UserController.user_signup);

router.delete("/:userId", chechAuth, UserController.user_delete);

router.post("/login", UserController.user_login);

router.get("/showusers", chechAuth, UserController.user_get_all);

export default router;
