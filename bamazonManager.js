//npm inquirer
const inquirer = require("inquirer");
//npm mysql
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Milo0917',
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
                        return false || "Cannot find item ID number, Please input again"
                    }
                }, {
                    type: "input",
                    message: "How many unit?",
                    name: "addQty",
                    validate: (val) => {
                        let valid = !isNaN(parseFloat(val)) && (val > 0);
                        return valid || "Please enter a number and quantity cannot be 0 or less than 0";
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
                        console.log(`---------------------\nInventory has been updated.\n---------------------\n`);
                        start();
                    })
                }
            }
        })
    })
}
function addNewProduct() {
    inquirer.prompt(
        [
            {
                type: "input",
                name: "newProduct_name",
                message: "What is the product's name?",
                validate: val => {
                    if (val == "") {
                        return false || "What is the product's name?"
                    }
                    return true;
                }
            },
            {
                type: "input",
                message: "What is the dapartment's name?",
                name: "department",
                validate: val => {
                    if (val == "") {
                        return false || "What is the department's name?"
                    }
                    return true;
                }
            },
            {
                type: "input",
                message: "What is the price?",
                name: "price",
                validate: (val) => {
                    let valid = !isNaN(parseFloat(val));
                    return valid || "Please enter a number";

                },
                filter: Number
            },
            {
                type: "input",
                message: "How many unit?",
                name: "qty",
                validate: (val) => {
                    let valid = !isNaN(parseFloat(val)) && (val > 0);
                    return valid || "Please enter a number (greater than 0)";
                }

            }
        ]
    ).then(ans => {
        console.log(`---------------------\n
        Product: ${ans.newProduct_name.toLowerCase()} \n
        Department: ${ans.department.toLowerCase()} \n
        Price: ${ans.price.toFixed(2)} \n
        Quantity: ${Math.round(ans.qty)} \n---------------------\n`);
        confirmProductInfo(ans);
    })
}

function confirmProductInfo(ans) {
    inquirer.prompt(
        [
            {
                type: "list",
                name: "confirm",
                choices: ["Yes", "No"],
                message: "Please confirm the info"
            }
        ]
    ).then(result => {
        if (result.confirm == "Yes") {
            //adding product into database
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: ans.newProduct_name.toLowerCase(),
                    department_name: ans.department.toLowerCase(),
                    price: ans.price.toFixed(2),
                    stock_quantity: Math.round(ans.qty)
                }
                , (err, res) => {
                    console.log(`---------------------\nItem has been added.\n---------------------\n`);
                    start();
                });

        } else {
            start();
        }
    });
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
