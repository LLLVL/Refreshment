require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("Connection error:", err));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/users", userRoutes);
app.use("/", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
