const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Client/views'));
app.use(express.static('Client/public'));
const port = 1337;

//JSON Parser
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// CONTROLLERS
const cryptoController = require('./controllers/CryptoController');
const portfolioController = require('./controllers/PortfolioController');
const accountController = require('./controllers/AccountController');
const cryptoData = require('./models/CryptoData');

// PAGE ROUTES
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: './Client/views' })
})

app.get('/home', function (req, res) {
  res.render('home', {loggedIn: accountController.loggedInHelper(req)})
})

app.get('/portfolio', function (req, res) {
  if(!accountController.loggedInHelper(req)) {
    res.redirect('/login');
    return;
  }
  res.render('portfolio')
})

app.get('/account', accountController.getAccountInfo)

app.get('/register', function (req, res) {
  res.render('register')
})
app.post('/register', accountController.createAccount)

app.get('/login', function (req, res) {
  res.render('login')
})
app.post('/login', accountController.login)

app.get('/logout', accountController.logout)

// API ROUTES

app.route('/api/cryptoData')
  .get(cryptoController.getCurrencies);

app.route('/api/cryptoData/:id')
  .get(cryptoController.viewDetail);

app.route('/api/cryptoData/sort')
  .post(cryptoController.sortCurrencies);

app.route('/api/cryptoData/search')
  .post(cryptoController.searchCurrencies);

app.route('/api/portfolio')
  .get(portfolioController.getPortfolio);

app.route('/api/portfolio/:id')
  .patch(portfolioController.addCrypto);

app.route('/api/portfolio/:id')
  .delete(portfolioController.removeCrypto);

app.route('/api/portfolio/value')
  .get(portfolioController.getPortfolioValue);

app.route('/api/portfolio/valueHistory')
  .get(portfolioController.getPortfolioValueHistory);

app.listen(port, async() => {
  await cryptoData.retrieveData();
  console.log(`Example app listening on port ${port}`)
})
