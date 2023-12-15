// detects spacebar press and calls nav functoin
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        navigateSite(0, "home");
    }
})

// is called when body from home.html is loaded
// builds the table displayed on the page
function init() {
    // create our table and put it in div1 from portfolio.html
    makePortfolioRows();

    // initRankTable(); NOT IMPLEMENTED in current project scope
}

// makes the table
async function makePortfolioRows() {
    const headers = [
        {name: "Name", type: String, attr: "name"},
        {name: "Symbol", type: String, attr: "symbol"},
        {name: "Current Price (USD)", type: String, attr: "currentPrice"},
        {name: "Amount", type: String, attr: "amount"},
        {name: "Purchase Price", type: String, attr: "purchasePrice"},
        {name: "Base Value", type: String, attr: "baseValue"},
        {name: "Current Value", type: String, attr: "currentValue"},
        {name: "Value Change", type: String, attr: "valueChange"},
        {name: "Value Change Percentage", type: String, attr: "valueChangePercentage"},
    ];

    const table = document.createElement("table");
    table.classList.add("displayTable")
    table.id = "portfolio";
    const headerRow = document.createElement("tr");
    for (const header of headers) {
        const cell = document.createElement("td");
        cell.innerHTML = header.name;
        cell.id = header.attr;
        cell.addEventListener('click', () => sortOnHeader(header));
        headerRow.appendChild(cell);
    }
    table.appendChild(headerRow);

    const portfolioResponse = await fetch('/api/portfolio');
    const portfolioData = await portfolioResponse.json();

    const tbody = document.createElement("tbody");
    tbody.id = "portfolioRows";

    for (const [symbol, prices] of Object.entries(portfolioData.ownedCrypto)) {
        const tableRow = document.createElement('tr');
        const upToDateCoin = portfolioData.upToDateCoins[symbol];
        // name
        let newTd = document.createElement("td");
        newTd.setAttribute("name", "name"); // Set attribute using setAttribute()
        newTd.innerHTML = upToDateCoin.name;
        tableRow.appendChild(newTd);

        // symbol
        newTd = document.createElement("td");
        newTd.setAttribute("name", "symbol");
        newTd.innerHTML = upToDateCoin.symbol;
        tableRow.appendChild(newTd);

        // current price
        newTd = document.createElement("td");
        newTd.setAttribute("name", "currentPrice");
        newTd.innerHTML = upToDateCoin.price;
        tableRow.appendChild(newTd);

        // amount
        newTd = document.createElement("td");
        newTd.setAttribute("name", "amount");
        newTd.innerHTML = prices.length;
        tableRow.appendChild(newTd);

        // purchasePrice
        newTd = document.createElement("td");
        newTd.setAttribute("name", "purchasePrice");
        let purchasePriceSum = 0;
        for (let price of prices) {
            purchasePriceSum += price;
        }
        newTd.innerHTML = purchasePriceSum / prices.length;
        tableRow.appendChild(newTd);

        // base value
        newTd = document.createElement("td");
        newTd.setAttribute("name", "baseValue");
        newTd.innerHTML = purchasePriceSum;
        tableRow.appendChild(newTd);

        // current value
        newTd = document.createElement("td");
        newTd.setAttribute("name", "currentValue");
        const baseValue = upToDateCoin.price * prices.length;
        newTd.innerHTML = baseValue;
        tableRow.appendChild(newTd);

        // value change
        newTd = document.createElement("td");
        newTd.setAttribute("name", "valueChange");
        const valueChange = baseValue - (upToDateCoin.price * prices.length);
        newTd.innerHTML = valueChange;
        if (valueChange > 0) {
            newTd.classList.add("positiveChange");
        } else if (valueChange < 0) {
            newTd.classList.add("negativeChange");
        }
        tableRow.appendChild(newTd);

        // value change percentage
        newTd = document.createElement("td");
        newTd.setAttribute("name", "valueChangePercentage");
        newTd.innerHTML = valueChange / baseValue;
        tableRow.appendChild(newTd);
        tbody.appendChild(tableRow)
    }

    table.appendChild(tbody)
    const divForTable = document.getElementById("portfolioTable");
    divForTable.replaceChildren(table)
}

let lastSort = null;
let isAsc = true;
function sortOnHeader(header) {
    if (header.attr === lastSort) {
        isAsc = !isAsc
    } else {
        isAsc = true;
    }
    const tbody = document.getElementById("portfolioRows");
    let rows = Array.from(tbody.querySelectorAll("tr"));
    rows.sort((rowA, rowB) => {
        const valueA = rowA.querySelector(`[name=${header.attr}]`).innerHTML;
        const valueB = rowB.querySelector(`[name=${header.attr}]`).innerHTML;
        
        if (isAsc) {
        return valueA.localeCompare(valueB, undefined, { numeric: true });
        } else {
        return valueB.localeCompare(valueA, undefined, { numeric: true });
        }
    });

    tbody.innerHTML = "";
    for (const row of rows) {
        tbody.appendChild(row);
    }

    lastSort = header.attr;
}

// fell out of project scope, leave for later implementation
function initRankTable() {
    let table = document.createElement("table");
    table.className = "rankTable";
    table.id = "rankTable";
    let div = document.getElementsByTagName("div1");
    div[0].appendChild(table);
    let tr;
    let th;

    // create headers
    // creates header row
    tr = document.createElement("tr");
    table.appendChild(tr);
    // iterates through the headers we need and adds them
    let headers = ['Rank', 'Name', 'Score', 'Date'];
    for (let i = 0; i < headers.length; i++) {
        th = document.createElement("th");
        tr.appendChild(th);
        th.innerHTML = headers[i];
    }

    const accountMunger = ['Munger', 980, '10/10/2023'];
    const accountArias = ['Arias', 940, '10/9/2023'];
    const accountBrogen = ['Brogen', 569, '10/7/2023'];
    const accountMcCullough = ['McCullough', 629, '10/8/2023'];
    const accountLongo = ['Longo', 432, '10/8/2023'];
    const accountTyler = ['Tyler', 554, '10/1/2023'];
    const accountSmith = ['Smith', 212, '10/3/2023'];
    const accountPerkins = ['Perkins', 45, '10/8/2023'];
    const accountMorales = ['Morales', 154, '10/4/2023'];
    const accountApril = ['April', 346, '10/6/2023'];

    let data = [accountMunger, accountArias, accountBrogen, accountMcCullough, accountLongo, accountTyler, accountSmith, accountPerkins, accountMorales, accountApril];
    // sort this array from biggest to smallest based on the score of each account (to make ranking accurate)
    data.sort((a, b) => b[1] - a[1]);

    let rowCount = -1;
    let colCount = 0;
    let cellTotal = data.length * headers.length;
    // console.log(cellTotal);
    // loops through each cell and adds the correct data
    for (let i = 0; i <= cellTotal; i++) {
        // move to new row if this one is full
        if (i % headers.length == 0) {
            if (tr) {
                table.appendChild(tr);
                rowCount++;
            }
            if (rowCount < data.length) {
                tr = document.createElement("tr");
            }
        }
        let cell = document.createElement("td");
        // error control
        if (rowCount < data.length) {
            if (colCount % headers.length == 0) {
                cell.innerHTML = rowCount + 1;
            } else {
                cell.innerHTML = data[rowCount][colCount % headers.length - 1];
            }
            tr.appendChild(cell);
            colCount++;
        }
    }
}

async function buyOrSellCoin() {
    const amount = document.getElementById("amountInput").value;
    const toggle = document.getElementById("buy/sell");
    let buyCoin;
    try {
        buyCoin = toggle.options[toggle.selectedIndex].value === "buy";
    } catch (err) {
        return;
    }
    const symbol = document.getElementById("cryptocurrency").value;
    let method;
    if (buyCoin) {
        method = 'PATCH';
    } else {
        method = "DELETE";
    }

    let result = await fetch(`/api/portfolio/${symbol}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({amount: amount, isSymbol: true})
    })
    const response = await result.json();
    const formContainer = document.getElementById("MarketForm");
    const addedDiv = document.createElement('div');
    addedDiv.innerHTML = response.message
    if(response.success) {
        addedDiv.classList.add("positiveChange");
    } else {
        addedDiv.classList.add("negativeChange");
    }
    formContainer.appendChild(addedDiv);
    makePortfolioRows();
}

// credit: this code was adapted from W3 schools
function fadeInAndOut() {
    const element = document.getElementById('elementToFade');

    if (element.style.opacity === '0' || element.style.opacity === '') {
        element.style.opacity = '1';
    } else {
        element.style.opacity = '0';
    }
}

// Call the fadeInAndOut function at regular intervals (e.g., every 2 seconds)
setInterval(fadeInAndOut, 1000);

// clears the form when cancel button pressed
function clearForm() {
    document.getElementById("cryptocurrency").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("buy/sell").value = "";
}
