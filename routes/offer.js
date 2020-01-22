// j'importe express pour l'utiliser pour mes routes

const express = require("express");
const router = express.Router();
const isAuthenticated = require("../Middeleware/isAuthenticated");

// J'importe les packages qui permettent l'encryption du mot de passe
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// J'importe mon model dans cette route
const Offer = require("../models/Offer");

// OFFER ***************************************************************

// CREATE OFFER

router.post("/publish", isAuthenticated, async (req, res) => {
  try {
    const offer = new Offer({
      title: req.fields.title,
      description: req.fields.description,
      price: req.fields.price,
      created: new Date(),
      creator: req.user._id
    });

    console.log("ici");
    await offer.save();
    console.log("la");

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
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
