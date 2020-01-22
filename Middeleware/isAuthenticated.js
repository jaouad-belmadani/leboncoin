// J'importe mon model User car c'est l'utilisateur que je dois authentifier...

const User = require("../models/User.js");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", "")
    });
    if (!user) {
      return res.status(401).json({ error: "not good token" });
    } else {
      // req.user = user crée une clé "user"dans req. La route pourra avoir accès à
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
