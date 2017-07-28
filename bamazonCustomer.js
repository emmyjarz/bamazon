const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'milomilo',
    database: 'bamazon'
});
let totalCost = 0;
const { table } = require('table'); 
let data,
    output;


connection.connect(err => {
    if (err) throw err;
    showAll();
});


function showAll() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        // console.log(`item_id \t product_name \t\t department_name \t\t price \t\t stock_quantity \n`);
        // for (let i = 0; i < res.length; i++) {
        //     console.log(`${res[i].item_id} \t\t ${res[i].product_name} \t\t ${res[i].department_name} \t\t ${res[i].price} \t\t ${res[i].stock_quantity}\n`);
        // }
        data = [
            ["item_id", "product_name", "department_name", "price", "stock_quantity"],
        ]
        for (let i = 0; i < res.length; i++) {
            let arr = [];
            // console.log(res.[0].item_id);
            arr.push(res[i].item_id);
            arr.push(res[i].product_name);
            arr.push(res[i].department_name);
            arr.push(res[i].price);
            arr.push(res[i].stock_quantity);
            data.push(arr)
        }
        // console.log(data);
        output = table(data);
        console.log(output);
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
                if (isNaN(val) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "unit",
            message: "How many units?",
            validate: val => {
                if (isNaN(val) === false) {
                    return true;
                }
                return false;
            }

        }
    ]).then(ans => {
        for (let i = 0; i < res.length; i++) {
            if (res[i].item_id == ans.itemId) {
                let choice = res[i];
                if (choice.stock_quantity >= ans.unit) {
                    //minus stock
                    connection.query("UPDATE products SET? WHERE?",
                        [
                            {
                                stock_quantity: (choice.stock_quantity - ans.unit)
                            },
                            {
                                item_id: choice.item_id
                            }
                        ],
                        (err, res) => {
                            //calculate the total cost
                            let cost = choice.price * ans.unit;
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
                console.log(`Your total is: ${totalCost.toFixed(2)} \n Thank you, hope to see you again!!`);
                connection.end();
                break;
        }
    })

}