// j'importe express pour l'utiliser pour mes routes

const express = require("express");
const router = express.Router();
const isAuthenticated = require("../Middeleware/isAuthenticated");

// J'importe mon model Offer dans cette route
const Offer = require("../models/Offer");

// OFFER ***************************************************************

// CREATE OFFER

router.post("/publish", isAuthenticated, async (req, res) => {
  try {
    if (
      req.fields.description.length > 500 ||
      req.fields.title.length > 50 ||
      req.fields.price > 100000
    ) {
      res.json({ message: "Vous devez respecter les limites imposé !" });
    } else {
      const offer = new Offer({
        title: req.fields.title,
        description: req.fields.description,
        price: req.fields.price,
        created: new Date(),
        creator: req.user._id
      });

      //console.log("ici");
      await offer.save();

      //console.log("la");

      res.json({
        _id: offer.id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        created: offer.created,
        creator: {
          account: {
            username: req.user.account.username,
            phone: req.user.account.phone
          },
          _id: req.user._id
        }
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
