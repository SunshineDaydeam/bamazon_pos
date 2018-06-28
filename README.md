## BAMAZON Inventory MGMT System
###### Created By Alex Bruner 06-27-2018

- This is a point of sale/inventory management system application that runs entirely in the terminal.
- There are two different javascript files in this project: manager mode and customer mode.
- To run this app, you will need:
	- A running MySQL server
	- Run NPM Install

### Customer Mode 
##### Shopping and Adding to Cart
- The user starts by selecting the number (id) of the product they would like to buy and the quantity that they would like to buy.

https://sunshinedaydeam.github.io/bamazon_pos/images/customer1.png?raw=true

- Then, they are asked to choose to KEEP SHOPPING, CHECKOUT, or QUIT.

##### Keep Shopping

- They are then prompted to choose another item and quantity.
- They are then brought back to choose between continuing to shop, checking out, or quitting.

##### Checkout

- They are shown their receipt which includes subtotal prices, sales tax, and grand total price.
- The quantity of those items they chose are removed from the SQL database.

### Manager Mode

##### View Products
- Displays All Products, including quantity and cost
##### View Low Inventory
- Displays All Products where inventory is less than 50 units
##### Adjust Quantity
- Allows user to manually reset a products quantity count in the database
##### Add Product
- Allows User to manually add a new product to the database
##### Quit
- Pretty self-explanatory.  Logs you out and closes the application.

### Questions?
###### You can contact me @ alexbruner@live.com.
