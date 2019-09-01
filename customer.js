var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Duck123456",
    database: "B-Amazon",
});

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    loadProducts();
});

function loadProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        promptCustomerForItem(res);
    });
}

function promptCustomerForItem(inventory) {
    inquirer
    .prompt([
        {
        type: "input",
        name: "choice",
        message: "what item you would like to purchase? [quit with Q]",
        validate: function(val){
            return !isNaN(val) || val.toLowerCase() === "q";
        }
    }
    ])
    .then(function(val) {
        checkIfShouldExit(val.choice);
        var choiceId = parseInt(val.choice);
        var product = checkInventory(choiceId, inventory);

        if (product) {
            promptCustomerForQuantity(product);
        }
        else {
            console.log("\nThat item is not the inventory. ");
            loadProducts();
        }
        });
    }

    function promptCustmoerFOrQuanity(product) {
        inquirer
        .prompt([
            {
                type: "input",
                name: "quantity",
                message: "how many would you like? [Quit with Q]",
                validate:function(val) {
                    return val > 0 || val.toLowerCase() === "q";
                }
                }
        ])
        .then(function(val) {
            checkIfShouldExit(val.quantity);
            var quantity = parseInt(val.quanitiy);

            if(quantity > product.stock_quantity) {
                console.log("\nInsufficient quantity!");
                loadProducts();
            }
            else {
                makePurchase(product, quantity);
            }
        });
    }

    