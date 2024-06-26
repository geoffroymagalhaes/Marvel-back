const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

// ---Signup-----

router.post("/user/signup", async (req, res) => {
  console.log("hello");
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json("Missing parameters");
    }
    const checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) {
      return res.status(400).json("This email is already being used!");
    }
    const salt = uid2(16);
    const hash = SHA256(req.body.password + salt).toString(encBase64);
    const token = uid2(64);

    const newSignup = new User({
      email: req.body.email,
      username: req.body.username,
      token: token,
      hash: hash,
      salt: salt,
    });
    await newSignup.save();
    res.json({
      _id: newSignup._id,
      token: newSignup.token,
      account: newSignup.account,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//   ---login---

router.post("/user/login", async (req, res) => {
  try {
    const userMatch = await User.findOne({ email: req.body.email });
    if (userMatch === null) {
      return res.json("it's all wrong mate! try again!");
    }

    const hash2 = SHA256(req.body.password + userMatch.salt).toString(
      encBase64
    );

    if (hash2 === userMatch.hash) {
      res.json({
        _id: userMatch._id,
        token: userMatch.token,
        account: userMatch.account,
      });
    } else {
      res.json("it's all wrong mate! try again!");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
