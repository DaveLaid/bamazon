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
	mainFunk();
});


function mainFunk(){

		inquirer.prompt([
		{
			type: "list",
			name: "login",
			message: "Select your view:",
			choices: ["MANAGER", "SUPERVISOR"]
		}

		]).then(function(selection){
			if(selection.login === "MANAGER") {
				managerView();
			}
			else if(selection.login === "SUPERVISOR") {
				// supervisorView();
				tableFlip();
			}
		});
}


function readProducts() {
	  console.log("");
	  console.log("---------ALL PRODUCTS--------\n");

	  connection.query("SELECT * FROM products", function(err, res) {
	    if (err) throw err;

	   var valuesArr = [];
	    for (var i = 0; i < res.length; i++) {
	    	var values = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity];
	    	valuesArr.push(values);
	    }
	    console.table(['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'], valuesArr);

	    // connection.end();
	  });
}


function managerView(){
	connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "managerList",
          type: "list",
          message: "Welcome Manager!  What would you like to do today?:",
          choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'EXIT']
        },
        ]).then(function(manSelection){
        	if (manSelection.managerList === "View Products for Sale"){
				readProducts();
				managerView();
			}
			else if(manSelection.managerList === "View Low Inventory") {
				viewLowInventory();
				managerView();
			}
			else if(manSelection.managerList === "Add to Inventory") {
				updateProduct();
			}
			else if(manSelection.managerList === "Add New Product") {
				addNewProduct();
			}
			else if(manSelection.managerList === "EXIT") {
				console.log("Goodbye!");
				connection.end();
			}
		});
	});
}


function viewLowInventory() {
	console.log("");
	console.log("---------Low Inventory--------\n");

	connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 4", function(err, res) {
	    if (err) throw err;
	    var lowArr = [];
		for (var i = 0; i < res.length; i++) {
			var lowValues = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity];
			lowArr.push(lowValues);
		}
		console.table(['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'], lowArr);

	});
}


var addStock;
function updateProduct() {
	console.log("");
	console.log("---------Add Stock Inventory--------\n");

	connection.query("SELECT * FROM products", function(err, res) {
	    if (err) throw err;

	   var valuesArr = [];
	    for (var i = 0; i < res.length; i++) {
	    	var values = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity];
	    	valuesArr.push(values);
	    }
	    console.table(['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'], valuesArr);

	    // connection.end();

	    inquirer.prompt([
			{
				type: "input",
				name: "productID",
				message: "What product would you like to add stock to? (ENTER ITEM ID #)",
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
				message: "How many units would you like to add?",
				validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }
			}
			]).then(function(ans){
				
		        for (var i = 0; i < res.length; i++) {
		          if (res[i].item_id == ans.productID) {
		            addStock = res[i];
		            
		          }
		        }

		          connection.query("UPDATE products SET ? WHERE ?", 
					[{stock_quantity: (addStock.stock_quantity + parseInt(ans.quantity))}, {item_id: parseInt(ans.productID)}],
		            function(error) {
		              if (error) throw err;
		              connection.end();
		            }
		          );
		          	managerView();
			        console.log("---------------------------------\n");
					console.log("-You have added additional stock-\n");
					console.log("---------------------------------\n");
			});
	});
}


function addNewProduct() {
// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES("Beowulf", "Books", 14.80, 40);
  console.log("Inserting new product into table.\n");

  inquirer.prompt([
			{
				type: "input",
				name: "productName",
				message: "Product Name that you would like to insert?:"
			},
			{
				type: "input",
				name: "departmentName",
				message: "What Department Category does the item belong in?:"
			},
			{
				type: "input",
				name: "priceAdded",
				message: "Set the price per unit:",
				validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }
			},
			{
				type: "input",
				name: "stockAmount",
				message: "How many units would you like to add?:",
				validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }
			}
			]).then(function(ans){
			  connection.query("INSERT INTO products SET ?",
			    {
				    product_name: ans.productName,
				    department_name: ans.departmentName,
				    price: ans.priceAdded,
				    stock_quantity: ans.stockAmount
			    },
			    function(err, res) {
			      
			      console.log("----------------------------------\n");
			      console.log("New product successfully inserted!\n");
			      console.log("----------------------------------\n");
			      readProducts();
			  
			      managerView();
			    }
			  );
			});
}



function tableFlip(){
	console.log("...........................................");
	console.log("......No time for Supervisor section.......");
	console.log("...........................................");
	console.log("AAAAARRRRRRRRRGGGGG     (╯°□°)╯~ ┻━┻       ");
	console.log("...........................................");
	console.log("I'm cool...I put table back... ┬─┬ /( ^_^/)");
	console.log("...........................................");
	mainFunk();
}
