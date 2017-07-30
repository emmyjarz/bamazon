//npm inquirer
const inquirer = require("inquirer");
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

let totalCost = 0;

connection.connect(err => {
    if (err) throw err;
    showAll();
});


function showAll() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        makeTable(res);
        buy(res);
    });
}
function buy(res) {
    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "What is the ID of the product would you like to buy?",
            validate: val => {
                if (isNaN(val) === false && val <= res.length) {
                    return true;
                }
                return false || "Cannot find item ID number, Please input again";
            }
        },
        {
            type: "input",
            name: "qty",
            message: "How many units?",
            validate: (val) => {
                let valid = !isNaN(parseFloat(val)) && (val > 0);
                return valid || "Please enter a number (greater than 0)";
            }
        }
    ]).then(ans => {
        let choiceId = parseInt(ans.itemId);
        let choiceQty = parseInt(ans.qty);
        for (let i = 0; i < res.length; i++) {
            if (res[i].item_id === choiceId) {
                let choice = res[i];
                if (choice.stock_quantity >= choiceQty) {
                    //minus stock
                    connection.query("UPDATE products SET? WHERE?",
                        [
                            {
                                stock_quantity: (choice.stock_quantity - choiceQty)
                            },
                            {
                                item_id: choice.item_id
                            }
                        ],
                        (err, res) => {
                            //calculate the total cost
                            let cost = choice.price * choiceQty;
                            totalCost += cost;
                            buyMore(totalCost);
                        }

                    )
                } else {
                    console.log(`---------------------\nInsufficient quatity!\n----------------------\n`);
                    buyMore(totalCost);
                }
            }
        }
    });
}
function buyMore(totalCost) {
    inquirer.prompt(
        [
            {
                type: "list",
                name: "more",
                message: "Would you like to buy anything else?",
                choices: ["yes", "no"]
            }
        ]
    ).then(ans => {
        console.log(ans.more)
        switch (ans.more) {
            case "yes":
                showAll();
                break;
            case "no":
                console.log(`-----------------------------------\nYour total is: $ ${totalCost.toFixed(2)} \nThank you, hope to see you again!!\n-----------------------------------\n`);
                connection.end();
                break;
        }
    })

}
function makeTable(res) {
    data = [
        ["item_id", "product_name", "department_name", "price"]
    ]
    for (let i = 0; i < res.length; i++) {
        let arr = [];
        arr.push(res[i].item_id);
        arr.push(res[i].product_name);
        arr.push(res[i].department_name);
        arr.push(`$ ${res[i].price}`);
        data.push(arr)
    }
    output = table(data);
    console.log(output);
}