var inquirer   = require('inquirer');
var mysql      = require('mysql');
require('console.table');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'david',
  database : 'bamazon'
});

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	// console.log('connected as id ' + connection.threadId);
	
});


// function mainFunk(){

// 		inquirer.prompt([
// 		{
// 			type: "list",
// 			name: "login",
// 			message: "Select your view:",
// 			choices: ["CUSTOMER", "MANAGER", "SUPERVISOR"]
// 		}

// 		]).then(function(selection){
// 			if (selection.login === "CUSTOMER"){
// 				customerView();
// 			}
// 			else if(selection.login === "MANAGER") {
// 				managerView();
// 			}
// 			else if(selection.login === "SUPERVISOR") {
// 				// supervisorView();
// 				tableFlip();
// 			}
// 		});
// }


function readProducts() {
	  console.log("");
	  console.log("---WELCOME VALUED CUSTOMER!---\n");
	  console.log("------------------------------\n");
	  console.log("---------ALL PRODUCTS---------\n");

	  connection.query("SELECT * FROM products", function(err, res) {
	    if (err) throw err;

	   var valuesArr = [];
	    for (var i = 0; i < res.length; i++) {
	    	var values = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity];
	    	valuesArr.push(values);
	    }
	    console.table(['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'], valuesArr);

	    // connection.end();
	    customerView();
	  });
}


var chosenItem;
var totalPrice;
var totalCost;
function customerView(){
	connection.query("SELECT * FROM products", function(err, results) {
	    if (err) throw err;
	    inquirer.prompt([
			{
				type: "input",
				name: "productID",
				message: "What product would you like to purchase? (ENTER ITEM ID #)",
				validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }
			},
			{
				type: "input",
				name: "quantity",
				message: "How many units would you like to purchase?",
				validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }
			}
			]).then(function(answer){
				
		        for (var i = 0; i < results.length; i++) {
		          if (results[i].item_id == answer.productID) {
		            chosenItem = results[i];
		            totalPrice = results[i].price;
		            totalCost = parseInt(answer.quantity) * totalPrice;
		          }
		        }
		        
				if ( parseInt(answer.quantity) <= chosenItem.stock_quantity ) {

		          connection.query("UPDATE products SET stock_quantity = stock_quantity - " + answer.quantity + " WHERE ?",
		          	[
		              {item_id: answer.productID}
		            ],
		            function(error) {
		              if (error) throw err;
		              connection.end();
		            }
		          );
			        console.log("------------------------------");
					console.log("-Thank you for your purchase!-");
					console.log("------------------------------");
					console.log("-Your total cost is: $" + totalCost.toFixed(2));
					console.log("------------------------------");
			        // readProducts();
		        }
		        else {
		          
		        	console.log("------------------------------");
		        	console.log("----INSUFFICIENT QUANTITY!----");
		        	console.log("----------Try again!----------");
		        	console.log("------------------------------");
		        	customerView();
		        }
			});
	});
}

readProducts();