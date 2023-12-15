let cryptoData = require('./CryptoData');
const mysql = require('mysql2/promise')
const DatabaseConnection = require('./DatabaseConnection');

class Portfolio {
    constructor(username, assets) {
        // never manage these / update these variables in instance methods
        //    bc the instances should be created and destroyed from database info
        //    on each operation
        this.username = username;
        // dictionary with keys of the crypto symbol and values of a list of prices
        this.ownedCrypto = assets;
        this.upToDateCoins = {};
        for (const assetSymbol in assets) {
            this.upToDateCoins[assetSymbol] = cryptoData.getUpdatedCoinBySymbol(assetSymbol);
        }
    }
    
    getPortfolioValue() {
        let baseValue = 0;
        let currentValue = 0;
        // check cryptoData object for latest crypto pricing etc
        for (const [symbol, prices] of Object.entries(this.ownedCrypto)) {
            const currentForThis = this.upToDateCoins[symbol]
            for (const price of prices) {
                currentValue += currentForThis;
                baseValue += price;
            }
        }
        return [baseValue, currentValue];
    }

    async addCrypto (id, amount) {
        const currentCoin = cryptoData.getUpdatedCoin(id);
        if (!currentCoin) { throw 'Failed to find coin.' }

        const idInCrpytos = currentCoin.symbol in this.ownedCrypto

        const con = await DatabaseConnection.getConnection()
        if(!idInCrpytos) {
            // if they don't own it already, give it to them
            await con.execute("INSERT INTO portfolio (username, symbol, name) \
            VALUES (?, ?, ?)",
            [this.username, currentCoin.symbol, currentCoin.name])
        }
        await con.execute("INSERT INTO `transaction` (username, symbol, amount, price, trans_date)\
                VALUES (?,?,?,?,?)",
                [this.username, currentCoin.symbol, amount, currentCoin.price*amount, new Date()])
        con.end()
        return `Successfully purchased ${amount} ${currentCoin.name} cryptocurriences!`;
    }

    async removeCrypto (id, amount) {
        const crypto = cryptoData.getUpdatedCoin(id);
        const symbol = crypto.symbol;
        if (!this.ownedCrypto[symbol]) { throw 'You do not have any of that currency'; }

        if(this.ownedCrypto[symbol].length < amount){
            throw 'You cannot sell more than you own!';
        }
        const soldCryptos = this.ownedCrypto[symbol].splice(0, amount);
        let soldTotal = 0;
        for(const soldValue of soldCryptos) {
            soldTotal += soldValue;
        }
        const con = await DatabaseConnection.getConnection();
        try {
            if(this.ownedCrypto[symbol].length === 0) {
                // ownedCrypto is now empty so delete all
                await con.execute("DELETE FROM `transaction` WHERE username=? and symbol=?;",
                    [this.username, symbol]);
                await con.execute("DELETE FROM portfolio WHERE username=? and symbol=?;",
                [this.username, symbol]);
            } else {
                // ownedCrpyto is not empty so just insert the transaction
                await con.execute("INSERT INTO `transaction` (username, symbol, amount, price, trans_date)\
                    VALUES (?,?,?,?,?)",
                    [this.username, symbol, Number(amount)*-1, soldTotal, new Date()])
            }
        } catch (error) {
            throw error;
        } finally {
            await con.end();
        }
            await con.end();
        return `Sold ${amount} of ${crypto.name} successfully for ${soldTotal}.`;
    }
}

async function generatePortfolio(username) {
    const con = await DatabaseConnection.getConnection()
    const accounts = await con.execute(
        'SELECT * FROM account WHERE username=?',
        [username]
    )
    if (!accounts[0][0]) { 
        await con.end()
        throw "There are no accounts with that username."
    }

    const entries = await con.execute("SELECT * FROM portfolio");
    // initing counts and assets
    const counts = {}
    let assets = {};
    for(const entry of entries[0]) {
        counts[entry.symbol] = 0;
        assets[entry.symbol] = [];
    }
    const transactions = await con.execute("SELECT * FROM transaction",
        [username]);
    await con.end();

    // adding counts
    for (const transaction of transactions[0]) {
        counts[transaction.symbol] += transaction.amount;
    }
    
    // creating assets
    for (const transaction of transactions[0]) {
        if (transaction.amount < 0 ) continue;

        const amountAdded = Math.min(transaction.amount, counts[transaction.symbol]); 
        for (let i=0; i < amountAdded; i++) {
            assets[transaction.symbol].push(Number(transaction.price) / transaction.amount);
        }
        counts[transaction.symbol] -= amountAdded;
    }


    let portfolio = new Portfolio(username, assets);

    //console.log(portfolio);
    return portfolio;
}

exports.generatePortfolio = generatePortfolio;