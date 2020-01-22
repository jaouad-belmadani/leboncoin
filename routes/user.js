// j'importe express pour l'utiliser pour mes routes

const express = require("express");
const router = express.Router();

// J'importe les packages qui permettent l'encryption du mot de passe
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// J'importe mon model dans cette route
const User = require("../models/User");

// USER **********************************

// CREATE USERS

router.post("/user/sign_up", async (req, res) => {
  try {
    // Le salt va être ajouté au password pour être "hashé"
    // console.log(salt);
    const salt = uid2(64);

    // Le hash est le resultat de l'encryption du mot de pass + salt
    const hash = SHA256(req.fields.password + salt).toString(encBase64);
    //console.log(hash);

    //Le token va nous servir plus tards, pour vérifier qu'un utilisateur a bien les droits pour effectuer une action donnée ( ex: poster une annonce sur le boncoin)
    const token = uid2(64);

    const user = await User.findOne({ email: req.fields.email });
    //console.log(checkEmail);
    if (user) {
      res.json({ message: "This email already has an account." });
    }
    if (!req.fields.username && !req.fields.email && !req.fields.password) {
      res.json({ message: "Missing parameter(s)" });
    } else {
      //Je crée un nouvel utilisteur sur la base du model que j'ai importe plus haut : const User = require("../models/User");
      const newUser = new User({
        email: req.fields.email,
        token: token,
        salt: salt, //Ne jamais renvoyer cette donnée dans le return
        hash: hash, // Ne jamais renvoyer cette donnée dans le return
        account: {
          username: req.fields.username,
          phone: req.fields.phone
        }
      });

      await newUser.save();
      // dans la réponse que l'on envoie au client, nous faisons attention à n'envoyer que les données nécessaires côté client (donc pas le hash, pas le salt, qui sont des données sensibles)

      return res.json({
        _id: newUser._id,
        token: newUser.token,
        account: newUser.account
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/log_in", async (req, res) => {
  try {
    // On cherche le user qui veut se connecter à partir de son email
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      if (
        // Si le SHA256(req.fields.password + user.salt) correspond à celui enregistré par la base de donnée lorsqu'il s'est inscris dans le sign_up, on fait le return
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        return res.json({
          _id: user._id,
          token: user.token,
          account: user.account
        });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return res.status(400).json("User not found");
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});
module.exports = router;
