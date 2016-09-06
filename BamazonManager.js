//require inquirer npm package
var inquirer = require('inquirer');
var mysql = require("mysql");
var passWord = "";

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: passWord, //Your password
    database: "bamazondb"
})

connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
})

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
                addProduct();
            break;
			case 'Exit Program':
                exitProgram();
            break;
			
        }
    })
};

var exitProgram = function(){
	connection.end(function(err){
	console.log("\nHave a nice day.")
	})
}

var runSearch = function() {
	
	connection.query("SELECT * FROM products", function(err, res){
	if(err) throw err;
	
	console.log("\nItem ID: Product Name : Department Name : $Price : StockQuantity" );
	
	for (i in res){
		console.log(res[i].itemID + ": " + res[i].productName + " : " + res[i].departmentName + " : $" + res[i].price + " : " + res[i].stockQuantity );
	}
	});
	mainMenu();
};

var	lowItem = function(){
	
	connection.query("SELECT * FROM products", function(err, res){
	if(err) throw err;
	
	console.log("\nItem ID: Product Name : Department Name : $Price : StockQuantity" );
	
	for (i in res){
		if (res[i].stockQuantity <= 5){
		console.log(res[i].itemID + ": " + res[i].productName + " : " + res[i].departmentName + " : $" + res[i].price + " : " + res[i].stockQuantity );
	}}
	});
	mainMenu();
};

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
		
		connection.query("SELECT * FROM products WHERE ?",{ itemID: answer.itemID}, function(err, res){
		if(err) throw err;
		
		isAdded = res[0].stockQuantity + answer.itemQuantity;

		connection.query("UPDATE products SET ? WHERE ?", [{ stockQuantity: isAdded},
		{itemID: itemID}], function(err, res){});
		console.log("Transaction processed.\nWould you like somthing else?");
		mainMenu();
	
		});
		
	});
};

var addProduct = function() {
	    inquirer.prompt({
        name: "itemQuantity",
        type: "input",
        message: "How Many do you want?",
    }).then(function(answer) {
		
		connection.query("SELECT * FROM products WHERE ?",{ itemID: itemID}, function(err, res){
		if(err) throw err;
		
		isEnough = res[0].stockQuantity - answer.itemQuantity;
		console.log(isEnough);
		if (isEnough >= 0){
			connection.query("UPDATE products SET ? WHERE ?", [{ stockQuantity: isEnough},
			{itemID: itemID}], function(err, res){});
			console.log("Transaction processed.\nWould you like somthing else?");
			runSearch();
			
		}
		else {console.log("Sorry we don't have enough to sell you that many. \nWould you like something else?");
		mainMenu();
		}	
	
		});
		
	});
};