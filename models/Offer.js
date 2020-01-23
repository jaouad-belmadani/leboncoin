//J'importe mongoose dans mon model User

const mongoose = require("mongoose");

//Je construis mon model
const Offer = mongoose.model("Offer", {
  title: String,
  description: String,
  price: Number,
  created: Date,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

//J'exporte mon model Offer
module.exports = Offer;
