DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
	item_id INT(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INT(10), 
    PRIMARY KEY (item_id)
   
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('tvs', 'electronics', 700, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('laptops', 'electronics', 499.99, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('desktops', 'electronics', 599.99, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('t-shirts', 'clothing', 7.99, 1000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('pants', 'clothing', 19.99, 500);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('socks', 'clothing', 4.99, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('coffee', 'beverages', 4.99, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('tea', 'beverages', 4.99, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('juice', 'beverages', 3.99, 200);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE('milk', 'beverages', 2.99, 300);
update products set stock_quantity = 4 where item_id = 4;

SELECT * FROM products;
SELECT * FROM products WHERE stock_quantity < 50;