const creatFilters = req => {
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
      // Sinon si il est definis dans ce cas je rentre dans mon else
    } else {
      filters.price.$lte = req.query.priceMax;
    }
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, "i");
    }
  }
};
