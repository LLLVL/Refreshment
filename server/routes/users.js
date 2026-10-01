const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/", verifyToken, async (req, res) => {
  let hashedPassword = null;
  if (req.body.password) {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  }

  const newUser = new User({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: hashedPassword,
  });

  await newUser.save();
  res.json(newUser);
});

router.delete("/:id", verifyToken, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

module.exports = router;