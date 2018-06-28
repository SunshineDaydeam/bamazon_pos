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
});

console.log("\nYou are now in MANAGER MODE.\n");
function managerMode(){
    
    inquirer.prompt([
        {type: "list",
        name: "choices",
        message: "What would You Like To Do Now?",
        choices: [
          "View Products",
          "View Low Inventory",
          "Adjust Quantity",
          "Add New Product",
          "View Total Inventory",
          "Margin Calculator",
          "Quit"
         ]}
    ]).then(function(answer){

        if (answer.choices == "View Products"){
            viewProduct();
        }
        else if (answer.choices == "View Low Inventory"){
            viewLowInventory();
        }
        else if (answer.choices == "Adjust Quantity"){
            adjustInventoryCount();
        }
        else if (answer.choices == "Add New Product"){
            addProduct();
        }
        else if (answer.choices == "Quit"){
            console.log("\nYou have been logged out of the system...\n");
            connection.end();
        }
        else if (answer.choices == "View Total Inventory"){
            totalInventoryCost();
        }
        else if (answer.choices == "Margin Calculator"){
            marginCalculator();
        }
        
        
    });
}
managerMode();

function adjustInventoryCount(){
    
    inquirer.prompt([
        {name: "productID", message: "Select the id of the product to Update"},
        {name: "quantity", message: "Enter the new inventory amount..."},
    ]).then(function(answer){
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    quantity: answer.quantity
                },
                {
                    id: answer.productID
                }
            ]
        );
        console.log("product Updated");
        managerMode();
    });

    
    
}
function viewProduct(){
    console.log("\nSelecting all products...\n");
    connection.query("SELECT * FROM products" , function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
            for (i=0; i<res.length; i++){
            console.log(res[i].description + ", $" + res[i].msrp + " " + res[i].quantity + " Available" + "   Cost: $" + res[i].cost);
        }
    console.log("\n");
    managerMode();
    });
}
function viewLowInventory(){
    console.log("\nSelecting all products with a quanity of less than 25 units...\n");
    connection.query("SELECT * FROM products WHERE quantity < 100" , function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
            for (i=0; i<res.length; i++){
            console.log(res[i].description + ", $" + res[i].msrp + " " + res[i].quantity + " Available");
        }
    console.log("\n");
    managerMode();
    });
}
function addProduct(){
    console.log("\nPlease enter the following information for the product you'd like to add to the database...\n");
    inquirer.prompt([
        {name:"sku", message: "SKU:"},
        {name:"brand", message: "Brand:"},
        {name:"description", message: "A Brief Description:"},
        {name:"department", message: "Department:"},
        {name:"quantity", message: "Initial Qty:"},
        {name:"cost", message: "Cost:"},
        {name:"msrp", message: "MSRP:"}
    ]).then(function(answer){
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
              sku: answer.sku,
              brand: answer.brand,
              description: answer.description,
              department: answer.department,
              quantity: answer.quantity,
              cost: answer.cost,
              msrp: answer.msrp
            },
            function(err, res) {
              console.log(res.affectedRows + " product inserted!\n");
              // Call updateProduct AFTER the INSERT completes
                managerMode();
            }
          );
    });
}

function totalInventoryCost(){
    console.log("You selected something");
}

function marginCalculator(){
    // console.log("\nSelecting all products...\n");
    // connection.query("SELECT * FROM products" , function(err, res) {
    //     if (err) throw err;
    //     // Log all results of the SELECT statement
    //         for (i=0; i<res.length; i++){
    //         console.log(res[i].description + ", $" + res[i].msrp + " " + res[i].quantity + " Available" + "   Cost: $" + res[i].cost);
    //     }
    // console.log("\n");
    // managerMode();
    // });
    console.log("not finished yet");
    managerMode();
}