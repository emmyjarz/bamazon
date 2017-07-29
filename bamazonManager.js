//npm inquirer
const inquirer = require("inquirer");
//npm mysql
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'milomilo',
    database: 'bamazon'
});

//npm table
const { table } = require('table');
let data,
    output;

connection.connect(err => {
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt(
        [
            {
                type: "list",
                name: "task",
                message: "Menu Options",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Exit the program"
                ]

            }
        ]
    ).then(ans => {
        switch (ans.task) {
            case "View Products for Sale":
                viewProduct();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit the program":
                stop();
                break;

        }
    })
}

function viewProduct() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        makeTable(res);
        start();
    })
}

function lowInventory() {
    let query = "SELECT * FROM products WHERE stock_quantity < 5"
    connection.query(query, (err, res) => {
        makeTable(res);
        start();
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        makeTable(res);
        inquirer.prompt(
            [
                {
                    type: "input",
                    message: "Please choose item ID to add inventory",
                    name: "addItemId",
                    validate: val => {
                        if (isNaN(val) === false && val <= res.length) {
                            return true;
                        }
                        return false
                    }
                }, {
                    type: "input",
                    message: "How many unit?",
                    name: "addQty",
                    validate: val => {
                        if (isNaN(val) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ]
        ).then(ans => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(ans.addItemId)) {

                    //update inventory
                    connection.query("UPDATE products SET? WHERE?", [
                        {
                            stock_quantity: res[i].stock_quantity + parseInt(ans.addQty)
                        },
                        {
                            item_id: res[i].item_id
                        }
                    ], (err, res) => {
                        console.log(`---------------------\nInventory has been update.\n----------------------\n`);
                        
                        start();
                    })
                }

            }
        })

    })


}







function stop() {
    connection.end();
}
function makeTable(res) {
    data = [
        ["item_id", "product_name", "department_name", "price", "stock_quantity"],
    ]
    for (let i = 0; i < res.length; i++) {
        let arr = [];
        arr.push(res[i].item_id);
        arr.push(res[i].product_name);
        arr.push(res[i].department_name);
        arr.push(`$ ${res[i].price}`);
        arr.push(res[i].stock_quantity);
        data.push(arr)
    }
    output = table(data);
    console.log(output);
}
