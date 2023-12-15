// calls init to update the cryptodata every 2 minutes
window.setInterval(init, 1000 * 60 * 2);

// is called when body from home.html is loaded
// builds the table displayed on the page
function init() {
    fetch('/api/cryptoData/')
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            insertTable(data);
        })
}

function insertTable(data) {
    // generate the search
    createSearchForm();

    // create our table and out it in div1 from home.html
    let table = document.createElement("table");
    table.className = "displayTable";
    table.id = "currencyTable";
    let container = document.getElementById("tableDiv");
    let tr;
    let th;

    // create headers
    // creates header row
    tr = document.createElement("tr");
    table.appendChild(tr);
    // iterates through the headers we need and adds them
    const headers = ['Rank', 'Name', 'Symbol', 'Price (USD)', '24hr Change (%)', 'Market Cap', 'Supply', 'Volume', 'Volume-Weighted Average Price (24h)'];
    const keys = ["rank", "name", "symbol", "price", "change", "marketCap", "supply", "volume", "vwap"];
    for (let i = 0; i < headers.length; i++) {
        th = document.createElement("th");
        th.id = i;
        th.setAttribute("onclick", `sortServer(${i})`);
        tr.appendChild(th);
        th.innerHTML = headers[i];
    }

    // create table and color in the change col
    for (let crypto of data) {
        let tr = document.createElement("tr");
        for (let key of keys) {
            let cell = document.createElement("td");
            if (key === "change") {
                // console.log(crypto.change);
                if (Number(crypto.change) >= 0) {
                    cell.className = "positiveChange";
                } else {
                    cell.className = "negativeChange";
                }
            }
            cell.innerHTML = crypto[key];
            tr.appendChild(cell);
        }
        tr.setAttribute("onclick", `openModal(${crypto.id})`);
        table.appendChild(tr);
    }

    container.replaceChildren(table);
}

// sorts the data on the server so that the user gets results from the full data, not just what they have
function sortServer(id) {
    const keys = ["rank", "name", "symbol", "price", "change", "marketCap", "supply", "volume", "vwap"];

    fetch('/api/cryptoData/sort', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sortParam: keys[id] })
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        let div = document.getElementById("tableDiv");
        div.replaceChildren();
        init();
    })
}

function openModal(id) {
    fetch('/api/cryptoData/' + id)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            insertDetailTable(data);
        })
    document.getElementById('detailPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('detailPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    closeSearchModal();
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function insertDetailTable(data) {
    //console.log(data);
    // creates the detail content in the modal window. This uses the raw data and handles buy/sell
    let para = document.getElementById('detailPara');
    let unsafeHTML = '<h1>Cryptocurrency Details </h1>' + `
    <p><strong>Name:</strong> ${data.name} | <strong>Symbol:</strong> ${data.symbol}</p>
    <p><strong>Market Rank:</strong> ${data.cmc_rank} | <strong>Date Added:</strong> ${formatDate(data.date_added)}</p>
    <p><strong>Circulating Supply:</strong> ${data.circulating_supply} | <strong>Total Supply:</strong> ${data.total_supply}</p>
    <p><strong>Max Supply:</strong> ${data.max_supply} | <strong>Price (USD):</strong> $${data.quote.USD.price}</p>
    <p><strong>Market Cap (USD):</strong> $${data.quote.USD.market_cap} | <strong>24h Volume (USD):</strong> $${data.quote.USD.volume_24h}</p>
    <p><strong>Last Updated:</strong> ${formatDate(data.last_updated)}</p>
    <div id="tags"><strong>Tags:</strong> ${data.tags.join(', ')}</div> `

    // only put the form when the user is logged in
    if (document.getElementById("loggedIn").value === "true") {
        unsafeHTML += ` <div class="form-container" id="buyForm">
        <p class = form-header>Market</p>
        <form id="MarketForm">
            <p> Cryptocurrency ID: ${data.id}</p>
            <label for="amount">Amount:</label>
            <input type="text" id="amount" name="amount" required>
            <br>
            <br>
            <button class="yellow-button" type="button" onclick="buyCoin(${data.id})">Buy</button>
            <button class="yellow-button" type="button" onclick="clearForm()">Cancel</button>
        </form>`
    }
    unsafeHTML += ` </div>`;
    para.innerHTML = unsafeHTML
}

// buys crypto for the user's portfolio
async function buyCoin(id) {
    const amount = document.getElementById("amount").value;
    let result = await fetch(`/api/portfolio/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: amount })
    })
    const response = await result.json();
    const formContainer = document.getElementById("buyForm")
    const addedDiv = document.createElement('div')
    addedDiv.innerHTML = response.message
    if (response.success) {
        addedDiv.classList.add("positiveChange")
    } else {
        addedDiv.classList.add("negativeChange")
    }
    formContainer.appendChild(addedDiv)
}

// clears the form when cancel button pressed
function clearForm() {
    document.getElementById("amount").value = "";
}

function createSearchForm() {
    // Create form element
    const form = document.createElement('form');
    form.addEventListener('submit', submitForm);
    form.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          submitForm();
        }
    });

    form.id = 'filterForm';

    // Field dropdown
    const fieldLabel = document.createElement('label');
    fieldLabel.for = 'field';
    fieldLabel.textContent = 'Select Field:';
    form.appendChild(fieldLabel);

    const fieldSelect = document.createElement('select');
    fieldSelect.id = 'field';
    fieldSelect.name = 'field';
    const fieldOptions = ['ID', 'Rank', 'Name', 'Symbol', 'Price', 'Change', 'Supply', 'Volume', 'VWAP'];

    fieldOptions.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.text = optionText;
        fieldSelect.appendChild(option);
    });

    form.appendChild(fieldSelect);

    // Operator dropdown
    const operatorLabel = document.createElement('label');
    operatorLabel.for = 'operator';
    operatorLabel.textContent = 'Select Operator:';
    form.appendChild(operatorLabel);

    const operatorSelect = document.createElement('select');
    operatorSelect.id = 'operator';
    operatorSelect.name = 'operator';

    const operatorOptions = ['=', '!=', '<', '>', '<=', '>='];

    operatorOptions.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.text = ` ${optionText} `;
        operatorSelect.appendChild(option);
    });

    form.appendChild(operatorSelect);

    // Value input
    const valueLabel = document.createElement('label');
    valueLabel.for = 'value';
    valueLabel.textContent = 'Enter Value:';
    form.appendChild(valueLabel);

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.id = 'value';
    valueInput.name = 'value';
    form.appendChild(valueInput);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Submit';
    submitButton.onclick = submitForm;
    form.appendChild(submitButton);

    // Append form to the form div
    document.getElementById('searchForm').appendChild(form);

    setTimeout(function() {
        // Check if the element exists before attempting to hide it
        if (form) {
          // Hide the element by setting its display property to 'none'
          form.style.display = 'none';
        }
    }, 120000);
}

// Function to handle form submission
async function submitForm() {
    const selectedField = document.getElementById('field').value.toLowerCase();
    const selectedOperator = document.getElementById('operator').value;
    const enteredValue = document.getElementById('value').value;

   // let postData = { selectedField, selectedOperator, enteredValue };
    let result = await fetch(`/api/cryptoData/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({field : selectedField, operator : selectedOperator, value : enteredValue}),
    })
    const response = await result.json();
    if (response) {
        //console.log(response);
        launchSearchModal(response);
    } else {
       // console.log(response);
        console.log('BAD SEARCH POST')
    }
    // console.log(`Selected Field: ${selectedField}`);
    // console.log(`Selected Operator: ${selectedOperator}`);
    // console.log(`Entered Value: ${enteredValue}`);
}

function launchSearchModal(dataArray) {
    //console.log(dataArray);
    dataArray = dataArray.slice(0,3);
    document.getElementById('overlay').style.display = 'block';
    const modal = document.getElementById('searchModal');
    const dataContainer = document.getElementById('data-container');

    // Clear previous content
    dataContainer.innerHTML = ''; 
    // Display each array of data
    if(dataArray[0].id){
        dataArray.forEach((data, index) => {
            const dataDiv = document.createElement('div');
            dataDiv.innerHTML = `<strong>ID:</strong> ${data.id}<br>
                            <strong>Rank:</strong> ${data.rank}<br>
                            <strong>Name:</strong> ${data.name}<br>
                            <strong>Symbol:</strong> ${data.symbol}<br>
                            <strong>Price:</strong> ${data.price}<br>
                            <strong>Change:</strong> ${data.change}<br>
                            <strong>Market Cap:</strong> ${data.marketCap}<br>
                            <strong>Supply:</strong> ${data.supply}<br>
                            <strong>Volume:</strong> ${data.volume}<br>
                            <strong>VWAP:</strong> ${data.vwap}<br>
                            <strong>Price History:</strong> ${data.priceHistory.join(', ')}<br><br>`;
            dataContainer.appendChild(dataDiv);
        });
    } else {
        const dataDiv = document.createElement('div');
        dataDiv.innerHTML = "<p1>No Results Found</p1>";
        dataContainer.append(dataDiv);
    }
    // Display the modal
    modal.style.display = 'flex';
}

// Function to close the modal
function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    document.getElementById('overlay').style.display = 'none';
    modal.style.display = 'none';
}