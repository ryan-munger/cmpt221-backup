const accountModel = require('../models/Account')

const loggedInHelper = (req) => {
    return Boolean(req.cookies && req.cookies.username)
}

exports.loggedInHelper = loggedInHelper

exports.login =  async function(req, res) {
    try {
        const {username} = req.body
        await accountModel.errOnInvalidLogin(req.body);
        res.cookie('username', username, {maxAge: 1000*60*15});
        res.redirect('/home');
    } catch (err) {
        res.render('login', {errorMessage: err})
        return
    }
}

exports.logout = function (req, res) {
    res.clearCookie('username')
    res.redirect('/')
}

exports.createAccount = async (req, res) => {
    const {username, password, password2} = req.body;
    if(password !== password2) {

        res.render('register', {errorMessage: "Passwords do not match"})
        return
    }

    try {
        await accountModel.makeAccount(req.body);
    } catch (err) {
        res.render('register', {errorMessage: err})
        return
    }

    res.cookie('username', username, {maxAge: 1000*60*15})
    res.redirect('/home');
}

exports.deleteAccount = function (req, res) {
    // out of scope, need query
}

exports.getAccountInfo = async (req, res) => {
    if(loggedInHelper(req)){
        const account = await accountModel.getAccountInfo(req.cookies.username)
        const context = { "account": account}
        res.render('account', context);
    } else {
        res.redirect('/login');
    }
}