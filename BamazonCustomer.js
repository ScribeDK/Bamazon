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
    runSearch();
})

var runSearch = function() {
	
	connection.query("SELECT * FROM products", function(err, res){
	if(err) throw err;
	
	console.log("\nItem ID: Product Name : Department Name : $Price : StockQuantity" );
	
	for (i in res){
		console.log(res[i].itemID + ": " + res[i].productName + " : " + res[i].departmentName + " : $" + res[i].price + " : " + res[i].stockQuantity );
	}
	selectItem();
	});
}
var	selectItem = function(){
    inquirer.prompt({
        name: "action",
        type: "input",
        message: "\nEnter the ItemID of what would you like to buy. \nEnter Q to quit.",
    }).then(function(answer) {
				if (answer.action.toUpperCase() == "Q"){
					connection.end(function(err){
					console.log("\nHave a nice day!");
					});
					}
				else if (answer.action > 0){
                buyItem(answer.action);
	}
	else {console.log("Invalid input. \nPlease retry.");
	runSearch();}
	})
};

var buyItem = function(itemID) {
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
		runSearch();
		}	
	
		});
		
	});
};