// moves the user to specified page on site
function navigateSite(detail, page) {
    if (detail) {
        location.assign("/detail?" + page);
    } else {
        location.assign("/" + page);
    }
}

// sorts a specified table based on a column
function sortTable(table_id, column) {
    // console.log('Clicked ' + column);
    // identify the table
    let table = document.getElementById(table_id);

    // does the sorting column possess numbers or string
    if (isNaN(Number(table.rows[1].cells[column].innerHTML))) {
        // console.log('not num')
        // selection sort, basically finding the max over and over
        for (let i = 1; i < table.rows.length; i++) {
            let max = table.rows[i].cells[column].innerHTML;
            let max_idx = i;
            // console.log("compare " + table.rows[i].cells[column].innerHTML + " to " + max + " result " + table.rows[i].cells[column].innerHTML.localeCompare(max));
            for (let j = i; j < table.rows.length; j++) {
                if (table.rows[j].cells[column].innerHTML.localeCompare(max) == -1) {
                    max = table.rows[j].cells[column].innerHTML;
                    max_idx = j;
                }
            }
            // move the max to the right spot
            table.insertBefore(table.rows[max_idx], table.rows[i]);
        }
    } else {
        for (let i = 1; i < table.rows.length; i++) {
            let max = Number(table.rows[i].cells[column].innerHTML);
            let max_idx = i;
            // console.log("compare " + Number(table.rows[i].cells[column].innerHTML) + " to " + max + " result " + Number(table.rows[i].cells[column].innerHTML) > max);
            // selection sort, basically finding the max over and over
            for (let j = i; j < table.rows.length; j++) {
                if (Number(table.rows[j].cells[column].innerHTML) > max) {
                    max = Number(table.rows[j].cells[column].innerHTML);
                    max_idx = j;
                }
            }
            // move the max to the right spot
            table.insertBefore(table.rows[max_idx], table.rows[i]);
        }
    }
}
