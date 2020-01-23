// J'importe mon model User car c'est l'utilisateur que je dois authentifier...

const User = require("../models/User.js");

const isAuthenticated = async (req, res, next) => {
  // Si j'ai un token dans headers ===> req.headers.authorization
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", "")
    });

    // Si il ne trouve pas le token demandé on rentre dans le if (!user)
    if (!user) {
      return res.status(401).json({ error: "not good token" });

      // Si le token existe on rentre dans le else ci dessous
    } else {
      // req.user = user crée une clé "user"dans req. On va pouvoir accéder au données de user
      req.user = user;
      return next();
    }
    // Si je n'ai pas de token je passe dans ce else : return res.status(401).json({ error: "Unauthorized" });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
