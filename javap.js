var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "inventory_management_db"
});

var currentInventory = [];

var shoppingCart=[];


connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
});

mainFunction();

function mainFunction(){
    connection.query("SELECT * FROM products",function(err, res){
        if (err) throw err;
        showAllProducts();
        chooseItems();
    });
}

function chooseItems(){
    connection.query("SELECT * FROM products",function(err, res){
        if (err) throw err;
        
        inquirer.prompt([
            {name: "productID", type: "number", message: "Which product would you like to purchase?"},
            {name: "quantity", type: "number", message: "How many would you like to purchase?"}
        ]).then(function(answer){
            var currProduct = res[answer.productID-1];

            if (currProduct != undefined){

                if (answer.quantity <= 0){
                    console.log("You selected a quantity of 0 or less, item was not added to your cart...");
                    chooseItems();
                }

                else if (answer.quantity > currProduct.quantity){
                    console.log("There are not enough of this item to complete your order");
                    chooseItems();
                }
                else{
                    console.log("\n" + answer.quantity + " " + currProduct.description + "(s) has been added to your cart...");

                    //add to shopping cart
                    shoppingCart.push({id: answer.productID, qty: answer.quantity});
                    console.log("Your shopping cart contains " + shoppingCart.length + " item(s)\n");
    
                    inquirer.prompt([
                        {type: "list",
                        name: "choices",
                        message: "What would You Like To Do Now?",
                        choices: [
                          "Keep Shopping",
                          "Checkout",
                          "Quit"
                         ]}
                    ]).then(function(answer){
    
                        if (answer.choices == "Keep Shopping"){
                            chooseItems();
                        }
                        else if (answer.choices == "Checkout"){
                            checkout();
                        }
                        else if (answer.choices == "Quit"){
                            endSale();
                        }
                        
                    });
                }
                

            }

            else if (currProduct == undefined){
                console.log("Please Choose a Real Product");
                chooseItems();
            }

            else{
                console.log("OH NOES... an error has occured");
            }

        })
    });
    
}




function showAllProducts(){
    connection.query("SELECT * FROM products" , function(err, res) {
        if (err) throw err;
        console.log("\n******** Available Items for Purchase********\n");
        for (i=0; i<res.length; i++){
            console.log(res[i].id + ". " + res[i].description + ", $" + res[i].msrp + " -------- " + res[i].quantity + " Available");
        
            currentInventory.push({
                id: res[i].id,
                qty: res[i].quantity,
                description: res[i].description,
                msrp: res[i].msrp
            });
        }
        // console.log(currentInventory);
        console.log("");


    });
}
function endSale(){
    console.log("\nYou Have Been Logged Out\n");
    connection.end();
}
function checkout(){
    for (i=0; i<shoppingCart.length; i++){

        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    quantity: currentInventory[shoppingCart[i].id -1].qty - shoppingCart[i].qty
                },
                {
                    id: shoppingCart[i].id
                }
            ],
            function(err, response) {
                console.log(response.affectedRows + " products updated!\n");
            }
        );
    }
    receipt();
}

function receipt(){
    connection.query("SELECT * FROM products",function(err, res){
        if (err) throw err;
        var subtotalPrice = 0;
        var totalPrice = 0;
        console.log('\n********** YOUR SALES ORDER ************\n');
        for (i=0; i<shoppingCart.length; i++){
            console.log("(" + shoppingCart[i].qty + ") " + currentInventory[shoppingCart[i].id -1].description + "(s)  Subtotal: " + (currentInventory[shoppingCart[i].id -1].msrp * shoppingCart[i].qty));
            subtotalPrice +=(currentInventory[shoppingCart[i].id -1].msrp * shoppingCart[i].qty);
        }
        console.log("Subtotal Price: $"+subtotalPrice);
        console.log("Sales tax (8.6%) is $"+subtotalPrice * 0.086 + "\n");
        console.log("You Grand total is $"+subtotalPrice * 1.086 + "\n");
        console.log('********** END OF SALES ORDER ************\n');
        endSale();
    });
}
