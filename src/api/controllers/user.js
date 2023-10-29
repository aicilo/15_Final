import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const user_signup = async (req, res, next) => {
  try {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    const email = await User.find({
      email: newUser.email,
    });

    if (email.length >= 1) {
      res.status(409).json({
        message: "Email is already exist!",
      });
    } else {
      const saveUser = await newUser.save();
      const result = {
        message: "User created",
        _id: saveUser._id,
        email: saveUser.email,
        password: saveUser.password,
      };
      console.log(result);
      res.status(201).json(result);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error });
  }
};

const user_delete = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const deleteUser = await User.deleteOne({ _id: id }).exec();
    const result = {
      message: "User deleted",
      response: {
        type: "POST",
        url: "http://localhost:3000/user/signup",
        body: {
          email: "String",
          password: "String",
        },
      },
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: error,
    });
  }
};

const user_login = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser.length < 1) {
      res.status(401).json({
        message: "Authorization Failed",
      });
    }

    bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
      if (err) {
        res.status(401).json({
          message: "Authorization Failed",
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: foundUser.email,
            userId: foundUser._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          message: "Authorization Successful",
          token: token,
        });
      } else {
        res.status(401).json({
          message: "Authorization Failed",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Authorization Failed",
    });
  }
};

const user_get_all = async (req, res, next) => {
  try {
    const users = await User.find().select("_id email password");
    const result = {
      count: users.length,
      users: users.map((user) => {
        return {
          _id: user._id,
          email: user.email,
          password: user.password,
          request: {
            type: "POST",
            url: `http://localhost:3000/user/signup/`,
            body: {
              email: "String",
              password: "String",
            },
          },
        };
      }),
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { user_signup, user_delete, user_login, user_get_all };
