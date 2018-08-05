var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

//var inStockQty;
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user 
  start();
});

  function processOrder(item_id, qty) {
    console.log("Processing order...\n");
    var inStockQty;
    var newQty;
    var totalPrice;
    
    connection.query("SELECT price, stock_quantity FROM products where item_id='" + item_id + "'", 
     function(err, res) {
      if (err) throw err;         
      inStockQty = res[0].stock_quantity;
      
      console.log("IN Stock :" + inStockQty);
      console.log("ordered qty :" + qty);
      console.log("id :" + item_id); 
      
      if(inStockQty >= qty){
      newQty = parseInt(inStockQty) - parseInt(qty);
      totalPrice = qty * res[0].price;
      console.log("new qty:" + newQty);      
      connection.query(
        "UPDATE products SET stock_quantity=" + newQty + " WHERE item_id=" + item_id,      
        function(err, res) {
          console.log(" order processed!\n");   
          console.log("Your total price is: " + totalPrice);      
          connection.end();    
        }
      );
      }
      else{
        console.log("Insufficient quantity..");
      }
    });        
    }

// function which prompts the user for what action they should take
function start() {
  console.log("Selecting all products...\n");
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(" ");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + "  " + res[i].product_name + "  " + res[i].price);
    }

    inquirer
    .prompt({
      name: "whatItem",
      type: "input",
      message: "What would you like to buy?"
    })
    .then(function(answer1) {
      inquirer
    .prompt(
    {
        name: "howMany",
        type: "input",
        message: "How many would you like to buy?"
      }
    )
    .then(function(answer2) {

        processOrder(answer1.whatItem, answer2.howMany);
      
    });

  });
  }); 
}
