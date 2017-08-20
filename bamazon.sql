CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER,
    PRIMARY KEY(item_id)
);

DESCRIBE products;

DROP TABLE products;

SELECT * FROM products;

-- DELETE FROM products WHERE item_id = 18;

UPDATE products SET stock_quantity = stock_quantity + 1000 WHERE item_id = 5;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Beowulf", "Books", 14.80, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Crocs Classic Clog", "Clothing", 19.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("JanSport Backpack", "Clothing", 38.50, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Fire TV Stick", "Electronics", 39.99, 2000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Kindle", "Electronics", 119.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Brita Water Pitcher", "Kitchen & Dining", 22.44, 70);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Wonder Woman (Blu-ray)", "Movies & TV", 24.99, 8000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Cards Against Humanity", "Toys & Games", 25, 3000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Play-Doh 10-pack", "Toys & Games", 7.99, 5000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Nintendo Switch", "Video Games", 376.48, 500);