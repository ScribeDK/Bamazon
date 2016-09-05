//require inquirer npm package
var inquirer = require('inquirer');
var mysql = require("mysql");
var passWord = "Jb3339550";

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: passWord, //Your password
    database: "topsongsdb"
})

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
})

var runSearch = function() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["Find songs by artist", "Find all artists who appear more than once", "Find data within a specific range", "Search for a specific song"]
    }).then(function(answer) {
        switch(answer.action) {
            case 'Find songs by artist':
                artistSearch();
            break;
            
            case 'Find all artists who appear more than once':
                multiSearch();
            break;
            
            case 'Find data within a specific range':
                rangeSearch();
            break;
            
            case 'Search for a specific song':
                songSearch();
            break;
        }
    })
};

var artistSearch = function() {
	    inquirer.prompt({
        name: "artistName",
        type: "input",
        message: "What artist would like to look for?",
    }).then(function(answer) {
	connection.query("SELECT * FROM top5000 WHERE ?",{ artist: answer.artistName}, function(err, res){
	if(err) throw err;
	for(i in res){
	console.log(res[i].song);
	}	
	});

connection.end(function(err){
	console.log("\nprocess ended")
	})});

}

var songSearch = function() {
	    inquirer.prompt({
        name: "songName",
        type: "input",
        message: "What song would like to look for?",
    }).then(function(answer) {
	connection.query("SELECT * FROM top5000 WHERE ?",{ song: answer.songName}, function(err, res){
	if(err) throw err;
	console.log(res);	
	
});

connection.end(function(err){
	console.log("\nprocess ended")
})});

}

var multiSearch = function() {
	connection.query("SELECT artist FROM top5000", function(err, res){
	if(err) throw err;
	var list = res;
	var output = [];
	for (i in list){
		for (e in list){
			if(i != e){
				if (list[i].artist == list[e].artist){
					var inList = false;
					for (q in output){
						if (list[i].artist == output[q]){
							inList = true;
							break;
						}
					}
					if (inList == false){
					output.push(list[i].artist);
					}
				}
			}
		}
	}
	console.log(output)
	console.log(output.length);
});

connection.end(function(err){
	console.log("\nprocess ended")
});

}

var rangeSearch = function() {
	    inquirer.prompt([{
        name: "startYear",
        type: "input",
        message: "What year would like to start at?",
    },{
        name: "endYear",
        type: "input",
        message: "What year would like to end at?",
    }]).then(function(answer) {
	connection.query("SELECT * FROM top5000", function(err, res){
	if(err) throw err;
	var list = res;
	var years = [];
	for (i in list){
		if (list[i].year >= answer.startYear && list[i].year <= answer.endYear){
			years.push(list[i]);
		}
	}
	console.log(years);
	
});

connection.end(function(err){
	console.log("\nprocess ended")
	})});

}