var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "inventory_management_db"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    askForSale();
});

function showProducts(){
    connection.query("SELECT * FROM products" , function(err, res) {
        if (err) throw err;
            for (i=0; i<res.length; i++){
                console.log(res[i].id + ". " + res[i].description + ", " + res[i].msrp + " " + res[i].quantity + " Available");
            }
        askForSale();
    });
}
function askForSale(){
    connection.query("SELECT * FROM products" , function(err, res) {
        if (err) throw err;
            for (i=0; i<res.length; i++){
                console.log(res[i].id + ". " + res[i].description + ", " + res[i].msrp + " " + res[i].quantity + " Available");
            }
        function shopOnline(){
            inquirer.prompt([
                {name: "productID", message: "Which product would you like to buy?"},
                {name: "quantity", message: "How many would you like to purchase?"}
            ]).then(function(answer){
                // console.log(res[answer.productID -1].brand + " " + res[answer.productID -1].description);
                // if it is an actual product...
                if (res[answer.productID - 1] != undefined){
                    // product they want to buy
                    var chosenProduct = (res[answer.productID - 1]);
                    // quantity they want to buy
                    var chosenQuantity = answer.quantity;
                    // number of available units
                    var availableQuantity = chosenProduct.quantity - chosenProduct.allocated;
                    
                    // ...if there arent enough total units...
                    if (availableQuantity < chosenQuantity){
                        console.log("\nYou requested " + chosenQuantity + " " + res[answer.productID -1].brand + " " + res[answer.productID -1].description+"s.\nUnfortunately we only have " + availableQuantity + " units available.\nPlease Choose a different product or amount.\n");
                    }
                    // ...if there are...
                    else{
                        var subtotalPrice = (chosenQuantity * chosenProduct.msrp);
                        console.log("\nYour shopping cart includes (" + chosenQuantity + ") " + res[answer.productID -1].brand + " " + res[answer.productID -1].description+"s.\nYour subtotal is $" + subtotalPrice + " + tax.\n");

                        inquirer.prompt([
                            {type: 'confirm',
                            name: 'addDelivery',
                            message: 'Do you need delivery/assembly for $199?'
                            },
                            {type: 'confirm',
                            name: 'confirmOrder',
                            message: 'Do you want to see your order summary?'
                            }
                        ]).then(function(userConfirmation){
                            if (userConfirmation.confirmOrder == true){
                                var totalPrice;
                                
                                //Display Order Confirmation
                                console.log("\nThank you for your order!\n \n*** Order Details ***\n \n(" + chosenQuantity + ") " + res[answer.productID -1].brand + " " + res[answer.productID -1].description+"s.\nSubtotal: $" + subtotalPrice+"\nSales Tax: $" + (subtotalPrice * 0.086));

                                if (userConfirmation.addDelivery == true){
                                    console.log("Delivery: $" + 199);
                                    console.log("Total: $" + ((subtotalPrice + 199)* 1.086));
                                }
                                else{
                                    console.log("Total: $" + (subtotalPrice * 1.086));
                                }
                                
                            }
                            else{
                                console.log("Please try another order");
                                shopOnline();
                            }
                        });
                        
                    }
                    
                    // shopOnline();
                }
                else{
                    console.log("That is not a product");
                    shopOnline();
                }
                
            });
        }
        shopOnline();
    });
    
}
function buyProduct(){
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                quantity: 14
            },
            {
                description: "HG-5 Home Gym"
            }
        ]
    );
    viewProduct();
}
function viewProduct(){
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products" , function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
            for (i=0; i<res.length; i++){
            console.log(res[i].description + ", $" + res[i].msrp + " " + res[i].quantity + " Available");
        }
    console.log("\n");
    connection.end();
    });
}
