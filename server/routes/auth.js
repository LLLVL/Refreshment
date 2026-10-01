const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = new User({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: hashedPassword,
  });

  await newUser.save();
  res.json(newUser);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !user.password) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Wrong password" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({ message: "Login successful!", token });
});

module.exports = router;
