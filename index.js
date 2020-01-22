// J'importe mes packages habituel...
const express = require("express");
const app = express();
const formidableMiddleware = require("express-formidable");
app.use(formidableMiddleware());
const router = express.Router();
const mongoose = require("mongoose");

// Je relie mongoose à ma base de donnée

mongoose.connect("mongodb://localhost/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
//J'importe mes routes dans mon index.js
const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.all("*", function(req, res) {
  res.json({ message: " all routes" });
});
app.listen(3000, () => {
  console.log(" Server Started");
});
