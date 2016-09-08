//require inquirer npm package
var inquirer = require('inquirer');
var mysql = require("mysql");
var passWord = ""; //Your password

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: passWord,
    database: "bamazondb"
})

connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
})

//let user select operation from list
var mainMenu = function(){
	inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit Program"]
    }).then(function(answer) {
        switch(answer.action) {
            case 'View Products for Sale':
                runSearch();
            break;
            
            case 'View Low Inventory':
                lowItem();
            break;
            
            case 'Add to Inventory':
                addItem();
            break;
            
            case 'Add New Product':
                newProductID();
            break;
			case 'Exit Program':
                exitProgram();
            break;
			
        }
    })
};

//end program
var exitProgram = function(){
	connection.end(function(err){
	console.log("\nHave a nice day.")
	})
}

//list all product data
var runSearch = function() {
	
	connection.query("SELECT * FROM products", function(err, res){
	if(err) throw err;
	
	console.log("\nItem ID: Product Name : Department Name : $Price : StockQuantity" );
	
	for (i in res){
		console.log(res[i].itemID + ": " + res[i].productName + " : " + res[i].departmentName + " : $" + res[i].price + " : " + res[i].stockQuantity );
	}
	mainMenu();
	});
	
};

//list all products with 5 or less units in stock
var	lowItem = function(){
	
	connection.query("SELECT * FROM products", function(err, res){
	if(err) throw err;
	
	console.log("\nItem ID: Product Name : Department Name : $Price : StockQuantity" );
	
	for (i in res){
		if (res[i].stockQuantity <= 5){
		console.log(res[i].itemID + ": " + res[i].productName + " : " + res[i].departmentName + " : $" + res[i].price + " : " + res[i].stockQuantity );
	}}
	mainMenu();
	});
	
};

// add new inventory to exiting products by item ID
var addItem = function() {
	    inquirer.prompt([{
        name: "itemID",
        type: "input",
        message: "Enter item ID.",
    },{
        name: "itemQuantity",
        type: "input",
        message: "How much stock has been added?",
    }]).then(function(answer) {
		console.log(answer.itemID);
		connection.query("SELECT * FROM products WHERE ?",{ itemID: answer.itemID}, function(err, res){
		if(err) throw err;
		
		isAdded = parseInt(res[0].stockQuantity) + parseInt(answer.itemQuantity);
		
		connection.query("UPDATE products SET ? WHERE ?", [{ stockQuantity: isAdded},
		{itemID: answer.itemID}], function(err, res){
			console.log("Items added.\nWould you like somthing else?");
			mainMenu();
		});
		
	
		});
		
	});
};

//get next itemID and pass to addProduct
var newProductID = function(){
	
		connection.query("SELECT * FROM products", function(err, res){
		if(err) {throw err;};
		var newItemID = 1;
		newItemID += res.length;
		addProduct(newItemID);
		});
};

//ask for new product data from user and add it to the database
var addProduct = function(newItemID) {
	    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "Enter item name.",
    },{
        name: "department",
        type: "input",
        message: "Enter item department",
    },{
        name: "price",
        type: "input",
        message: "Enter item price.",
    },{
        name: "itemQuantity",
        type: "input",
        message: "How much stock has been added?",
    }]).then(function(answer) {
		
		var itemPrice = parseFloat(answer.price);
		var itemNum = parseInt(answer.itemQuantity);
		
		connection.query("INSERT INTO products SET ?", {
		itemID: newItemID,
		productName: answer.name,
		departmentName: answer.department,
		price: itemPrice,
		stockQuantity: itemNum
	}, function(err, res){
		console.log("New product added.\nWould you like somthing else?");
		mainMenu();
		});		
	});
};