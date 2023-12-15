const tempData = require('./crypto_example.json');
const axios = require('axios');

class CryptoData {
    constructor(cryptoCurrencies) {
        this.cryptoCurrencies = cryptoCurrencies;
        this.currentSort = "id";
        this.currentDirection = 'ASC';
        this.searchQuery = null;
        this.searchResults = [];
        this.currentCrypto = null;
        this.rawData = null;
    }

    sortCurrencies(sortParam) {
        if (sortParam === this.currentSort) {
            // is this the same param as last time? if so, we need to change order of sort
            if (this.currentDirection == 'ASC') {
                this.currentDirection = 'DESC';
            } else {
                this.currentDirection = 'ASC';
            }
        } else {
            this.currentSortDirection = 'ASC';
        }

        this.currentSort = sortParam;

        // sort array, these functions allow us to use the sort feature and change based upon direction
        function compareObjectsNumber(property, dir) {
            return function (a, b) {
                if (a[property] < b[property]) {
                    if (dir == 'ASC') {
                        return -1;
                    } else {
                        return 1;
                    }

                } else if (a[property] > b[property]) {
                    if (dir == 'ASC') {
                        return 1;
                    } else {
                        return -1;
                    }
                }
                return 0;
            };
        }
        function compareObjectsString(property, dir) {
            return function (a, b) {
                let string1 = a[property];
                let string2 = b[property];
                if (dir == 'ASC') {
                    return (string1.localeCompare(string2));
                } else {
                    return (-1 * string1.localeCompare(string2));
                }
            };
        }

        // sort the array
        //console.log(typeof(this.cryptoCurrencies[0][sortParam]));
        // console.log(this.cryptoCurrencies[0][sortParam]);
        // console.log(sortParam);
        //console.log(typeof(this.cryptoCurrencies[0][sortParam]) == 'number');
        //console.log(this.currentDirection);
        if (typeof (this.cryptoCurrencies[0][sortParam]) == 'number') {
            this.cryptoCurrencies.sort(compareObjectsNumber(sortParam, this.currentDirection));
        } else {
            this.cryptoCurrencies.sort(compareObjectsString(sortParam, this.currentDirection));
        }
    }

    searchCurrencies(field, operator, value) {
        this.searchResults = [];
        // check each currency and record it if it matches criteria
        // switch is to compare using intended operator 
        for (let i = 0; i < this.cryptoCurrencies.length; i++) {
            switch (operator) {
                case "=":
                    if (this.cryptoCurrencies[i][field] == value)
                        cryptoData.searchResults.push(cryptoData.cryptoCurrencies[i]);
                    break;
                case ">":
                    if (this.cryptoCurrencies[i][field] > value)
                        this.searchResults.push(this.cryptoCurrencies[i]);
                    break;
                case "<":
                    if (this.cryptoCurrencies[i][field] < value)
                        this.searchResults.push(this.cryptoCurrencies[i]);
                    break;
                case ">=":
                    if (this.cryptoCurrencies[i][field] >= value)
                        this.searchResults.push(this.cryptoCurrencies[i]);
                    break;
                case "<=":
                    if (this.cryptoCurrencies[i][field] <= value)
                        this.searchResults.push(this.cryptoCurrencies[i]);
                    break;
                case "!=":
                    if (this.cryptoCurrencies[i][field] != value)
                        this.searchResults.push(this.cryptoCurrencies[i]);
                    break;
                default:
                    return 'Invalid Operation Entered: ' + operator;
            }
        }
        if (this.searchResults.length == 0) {
            this.searchResults.push('No matches found.');
        }
        return this.searchResults;
    }
};

class CryptoCurrency {
    constructor(id, rank, name, symbol, price, change, marketCap, supply, volume, vwap, lastUpdated) {
        this.id = Number(id);
        this.rank = Number(rank);
        this.name = name;
        this.symbol = symbol;
        this.price = Number(price);
        this.change = Number(change);
        this.marketCap = Number(marketCap);
        this.supply = Number(supply);
        this.volume = Number(volume);
        this.vwap = Number(vwap);
        this.priceHistory = [price, lastUpdated];
    }
}

const cryptoData = new CryptoData();

// gets list of currencies from json
// const rawCurrencyData = tempData["data"];

const getData = async () => {
    let response = null;
    try {
        response = await
            axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5000', {
                headers: {
                    'X-CMC_PRO_API_KEY': '11c490fb-249e-42c7-8b17-fe881c0fe5b5',
                },
            });
    } catch (ex) {
        throw ex;
    }
    if (response) {
        // success
        //console.log(response.data)
        return response.data;
    }
};

async function retrieveData() {
    let cryptoInstances = [];
    let rawCurrencyData = (await getData()).data;

    // build an object for each currency
    for (let i = 0; i < rawCurrencyData.length; i++) {
        let currentCrypto = rawCurrencyData[i];
        // build a new object from json data
        let newCrypto = new CryptoCurrency(
            currentCrypto["id"],
            currentCrypto["cmc_rank"],
            currentCrypto["name"],
            currentCrypto["symbol"],
            currentCrypto["quote"]["USD"]["price"],
            currentCrypto["quote"]["USD"]["percent_change_24h"],
            currentCrypto["quote"]["USD"]["market_cap"],
            currentCrypto["circulating_supply"],
            currentCrypto["quote"]["USD"]["volume_24h"],
            (currentCrypto["quote"]["USD"]["price"] * currentCrypto["circulating_supply"]) / currentCrypto["total_supply"], // vwap
            currentCrypto["last_updated"]
        );
        cryptoInstances.push(newCrypto);
    }
    cryptoData.cryptoCurrencies = cryptoInstances;
    cryptoData.rawData = rawCurrencyData;
    //console.log(rawCurrencyData.length);
   // console.log('new data!');
}

exports.retrieveData = retrieveData;
// gets new data from coinmarket every 2 min
setInterval(retrieveData, 1000 * 60 * 2);

exports.cryptoData = cryptoData;

exports.getUpdatedCoin = (id) => {
    for (let i = 0; i < cryptoData.cryptoCurrencies.length; i++) {
        if (cryptoData.cryptoCurrencies[i].id == id) {
            return cryptoData.cryptoCurrencies[i];
        }
    }
}

exports.getUpdatedCoinBySymbol = (symbol) => {
    //console.log(symbol);
    for (let i = 0; i < cryptoData.cryptoCurrencies.length; i++) {
       // console.log(`|${symbol}===${cryptoData.cryptoCurrencies[i].symbol}|`);
        if (cryptoData.cryptoCurrencies[i].symbol === symbol) {
            return cryptoData.cryptoCurrencies[i];
        }
    }
    //console.log('Not found');
}



