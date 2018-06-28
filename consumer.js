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
        console.log("\nShop Here on Bamazon for all your fitness needs...\n");
            for (i=0; i<res.length; i++){
                console.log(res[i].id + ". " + res[i].description + ", $" + res[i].msrp + "  ------  " + res[i].quantity+ " Units Available");
            }
        console.log("");

        function shopOnline(){
            inquirer.prompt([
                {name: "productID", message: "Which number product would you like to buy?"},
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

                    
                    // ...if there arent enough total units...
                    if (chosenProduct.quantity < chosenQuantity){
                        console.log("\nYou requested " + chosenQuantity + " " + chosenProduct.brand + " " + chosenProduct.description+"s.\nUnfortunately we only have " + availableQuantity + " units available.\nPlease Choose a different product or amount.\n");
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
                                //Display Order Confirmation
                                console.log("\n \n*** Order Details ***\n \n(" + chosenQuantity + ") " + res[answer.productID -1].brand + " " + res[answer.productID -1].description+"s.\nSubtotal: $" + subtotalPrice+"\nSales Tax: $" + (subtotalPrice * 0.086));
                                if (userConfirmation.addDelivery == true){
                                    console.log("Delivery: $" + 199);
                                    console.log("Total: $" + ((subtotalPrice + 199)* 1.086));
                                }
                                if (userConfirmation.addDelivery != true){
                                    console.log("Total: $" + (subtotalPrice * 1.086 +"\n"));
                                }
                                inquirer.prompt([
                                    {
                                        type:'confirm',
                                        name:'checkout',
                                        message:'Type YES to place your order.'
                                    }
                                ]).then(function(orderCheckout){
                                    console.log("");
                                    if (orderCheckout.checkout === true){

                                        console.log("Your order has been placed.");
                                        var query = connection.query(
                                            "UPDATE products SET ? WHERE ?",
                                            [
                                                {
                                                    quantity: chosenProduct.quantity - chosenQuantity
                                                },
                                                {
                                                    id: answer.productID
                                                }
                                            ],
                                            function(err, response) {
                                                console.log(response.affectedRows + " products updated!\n");
                                                inquirer.prompt([
                                                    {type: "list", name: "orderAgain", message: "What would you like to do now?", choices:["Place another Order", "Quit"]}
                                                ]).then(function(answer){
                                                    if (answer.orderAgain == "Place another Order"){
                                                        askForSale();
                                                    }
                                                    else{
                                                        endOrder();
                                                    }
                                                });
                                            }
                                        );

                                        // inquirer.prompt([
                                        //     {type: "list", name: "orderAgain", message: "What would you like to do now?", choices:["Place another Order", "Quit"]}
                                        // ]).then(function(answer){
                                        //     if (answer.orderAgain == "Place Another Order"){
                                        //         askForSale();
                                        //     }
                                        //     else{
                                        //         endOrder();
                                        //     }
                                        // });
                                    }
                                    else{
                                        console.log("Please come back if you decide to buy in the future");
                                        console.log("Have a great day!\n");
                                        endOrder();

                                    }
                                });
                                
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

function endOrder(){
    console.log("\nHave a great day. You have been logged out.\n");
    connection.end();
    return;
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
