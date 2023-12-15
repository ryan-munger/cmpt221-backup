const cryptoData = require('../models/CryptoData');

exports.getCurrencies = function (req, res) {
   res.setHeader('Content-Type', 'application/json');
   res.send(cryptoData.cryptoData.cryptoCurrencies.slice(0, 50));
}

exports.sortCurrencies = function (req, res) {
   let field = req.body.sortParam;
   // ensure params passed are valid
   if (req.body && field && cryptoData.cryptoData.cryptoCurrencies[0].hasOwnProperty(field) && (field != 'priceHistory')) {
      cryptoData.cryptoData.sortCurrencies(field);
      res.setHeader('Content-Type', 'application/json');
      res.send(cryptoData.cryptoData.cryptoCurrencies.slice(0, 50));
   } else {
      res.status(400).json({ message: 'Error: invalid sort request. Body param required: sortParam' });
   }
}

exports.searchCurrencies = function (req, res) {
   // ensure params passed are valid
   if (req.body && req.body.field && req.body.operator && (req.body.value != null)) {
      if (cryptoData.cryptoData.cryptoCurrencies[0].hasOwnProperty(req.body.field)) {
         cryptoData.cryptoData.searchQuery = req.body;
         res.send(cryptoData.cryptoData.searchCurrencies(req.body.field, req.body.operator, req.body.value));
      } else {
         res.status(400).json({ message: "Error: invalid search field " + req.body.field });
      }
   } else {
      res.status(400).json({ message: 'Error: bad search query. Format: Field, Operator, Value' });
   }
}

exports.viewDetail = function (req, res) {
   // find the right crypto based on ID and return more data than available thru cryptodata obj
   let response;
   const raw = cryptoData.cryptoData.rawData;

   for(let i = 0; i < raw.length; i++) {
      if(raw[i].id == req.params.id){
         response = true;
         res.send(raw[i]);
      }
   }
   if(!response) {
      res.status(404).json({ message: 'No currency associated with ID ' + req.params.id + '!' });
   }
}

