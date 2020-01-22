//J'importe mongoose dans mon model User

const mongoose = require("mongoose");

//Je construis mon model
const User = mongoose.model("User", {
  email: { type: String, unique: true },
  token: String,
  hash: String,
  salt: String,
  account: {
    username: { type: String, required: true },
    phone: { type: String }
  }
});

module.exports = User;
