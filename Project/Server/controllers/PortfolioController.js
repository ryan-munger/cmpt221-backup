const cryptoData = require('../models/CryptoData');
const portfolio = require('../models/Portfolio');
const accountController = require('./AccountController')

exports.getPortfolio = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (!accountController.loggedInHelper(req)) {
        res.status(400).json({message: 'No username given! Your session likely expired.'});
        return
    }
    const portfolioObject = await portfolio.generatePortfolio(req.cookies.username);
    res.send(portfolioObject);
}

exports.addCrypto = async function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    // ensure the currency exists and all params are present
    if (!accountController.loggedInHelper(req)) {
        res.status(400).json({message: 'No username given! Your session likely expired.'});
        return;
    } else if(!req.params.id) {
        res.status(400).json({message: 'No coin ID given!'});
        return;
    }
    let cryptoId;
    if (req.body.isSymbol) {
        let crypto = cryptoData.getUpdatedCoinBySymbol(req.params.id);
        if (!crypto) {
            res.status(400).json({message: 'Coin symbol not found!'});
            return;
        }
        cryptoId = crypto.id;
    } else {
        cryptoId = Number(req.params.id);
    }
    try {
        const portfolioObject = await portfolio.generatePortfolio(req.cookies.username);
        const amount = req.body.amount;
        if (!amount) {
            res.status(400).json({message: 'No amount given!'});
            return;
        }
        const message = await portfolioObject.addCrypto(cryptoId, amount);
        res.send({message: message, success: true})
    } catch(err) {
        //console.log(err.message);
        res.status(400).json({message: err});
    }
}

exports.removeCrypto = async function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    if (!accountController.loggedInHelper(req)) {
        res.status(400).json({message: 'No username given! Your session likely expired.'});
        return
    } else if(!req.params.id) {
        res.status(400).json({message: 'No coin id given!'});
        return
    }
    let cryptoId;
    if (req.body.isSymbol) {
        let crypto = cryptoData.getUpdatedCoinBySymbol(req.params.id);
        if (!crypto) {
            res.status(400).json({message: 'Coin symbol not found!'});
            return;
        }
        cryptoId = crypto.id;
    } else {
        cryptoId = Number(req.params.id);
    }
    try {
        const portfolioObject = await portfolio.generatePortfolio(req.cookies.username);
        const amount = req.body.amount;
        if (!amount) {
            res.status(400).json({message: 'No amount given!'});
            return;
        }
        const message = await portfolioObject.removeCrypto(cryptoId, amount);
        res.send({message: message, success: true})
    } catch(err) {
        console.log(err);
        res.status(400).json({message: err});
    }
}

exports.getPortfolioValue = function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    portfolio.getPortfolioValue();
    // if this sends as a number, it is falsely interpreted as a status code
    res.send(portfolio.totalValue + '');
}

exports.getPortfolioValueHistory = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    portfolio.getPortfolioValue();
    res.send(portfolio.valueHistory);
}