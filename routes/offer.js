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

// ROUTE EN GET

// router.get("/offer/with-count", async (req, res) => {
//     try {
//       const offersCount = await Offer.countDocuments();
//       const offers = await Offer.find().populate("creator", "account");
//       res.json({ count: offersCount, offers: offers });
//     } catch (error) {
//       res.json({ message: error.message });
//     }
//   });

// CREATION DE LA FONCTION FILTERS
const createFilters = req => {
  // Je crée un objet vide pour stocker les differents filtres que j'aurai en requête de type query

  const filters = {};

  //Si je reçois une requête query avec un prix minimum je rentre dans cette condition

  if (req.query.priceMin) {
    // je crée un objet filters.price qui stockera les annonces correspondantes au filtre, à savoir le prix minimum renseigné coté client

    filters.price = {};
    // Avec la methode $gte de mongodb je vais pouvoir filtrer le prix min, qui correspondra à ce qui sera renseigné coté client en paramètre query

    filters.price.$gte = req.query.priceMin;
  }
  //Si je reçois une requête query avec un prix Maximum je rentre dans cette condition

  if (req.query.priceMax) {
    //Si le filters.price est undefined on laisse l'objet filters. price vide

    if (filters.price === undefined) {
      filters.price = {};
    }
    // Sinon si il est definis dans ce cas je rentre dans mon else

    filters.price.$lte = req.query.priceMax;
  }
  // Si je reçois une requête query avec un title , je renvoi les annonces qui correspondent à ce title , et avec new RegExp(req.query.title, "i"); la casse renvoyé n'est pas prise en compte, et en tapant juste le debut du title je peux avoir accés à la requête demandé

  if (req.query.title) {
    filters.title = new RegExp(req.query.title, "i");
  }
  // Enfin ma fonction  renvoi filters, donc mon objet filters
  return filters;
};

router.get("/offer/with-count", async (req, res) => {
  // const filters ici est differents du const filters à l'intérieur de la fonction ci dessus, ici nous stockons la fonction creatFilters(req), qui a pour paramètre req, dans const filters
  const filters = createFilters(req);
  // Ici, nous construisons notre recherche
  const search = Offer.find(filters).populate("creator", "account"); // ici la recherche n'est pas déclenché car pas de await, le await déclenchera à la fin la recherche
  if (req.query.sort === "price-asc") {
    // Ici, nous continuons de construire notre recherche
    // search.sort nous permet de trier notre recherche {price : 1 } ===> trier les prix en ascendant
    search.sort({ price: 1 });
  } else if (req.query.sort === "price-desc") {
    // Ici, nous continuons de construire notre recherche
    // search.sort nous permet de trier notre recherche {price : -1 } ===> trier les prix en descendant

    search.sort({ price: -1 });
  }
  // limit : le nombre de résultats affichés
  // skip : Ignorer les X premiers
  if (req.query.page) {
    const page = req.query.page;
    const limit = 4;
    search.limit(limit).skip(limit * (page - 1));
  }
  // la recherche est déclenchée grâce au await
  const offers = await search;
  res.json(offers);
});

router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById({ _id: req.params.id }).populate(
      "creator",
      "account"
    );
    res.json(offer);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
