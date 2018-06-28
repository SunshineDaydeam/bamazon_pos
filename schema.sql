DROP DATABASE IF EXISTS inventory_management_db;
CREATE DATABASE inventory_management_db;

USE inventory_management_db;

DROP TABLE IF EXISTS products;
CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT,
	sku VARCHAR(10) NOT NULL,
	brand VARCHAR(45) NULL,
	description VARCHAR(100) NULL,
	department VARCHAR(45) NOT NULL,
	quantity INT(10) NULL,
	cost DECIMAL(10,2) NOT NULL,
	msrp DECIMAL(10,2) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO products (sku, brand, description, department, quantity, cost, msrp)
VALUES 
("TM-18", "Fitness one", "TM-18 Treadmill", "treadmill", 12, 425, 699),
("TM-36x", "Fitness one", "TM-36x Treadmill", "treadmill", 8, 1275, 2699),
("E-10", "Fitness one", "E-10 Elliptical", "elliptical", 22, 375, 699),
("E-30x", "Fitness one", "E-30x Elliptical", "treadmill", 6, 1300, 2699),

("FM-HG3", "Fitness Maker", "HG-3 Home Gym", "gym", 10, 600, 999),
("FM-HG5", "Fitness Maker", "HG-5 Home Gym", "gym", 11, 1400, 2499),
("FM-FT3", "Fitness Maker", "FT-3 Functional Trainer", "gym", 4, 860, 1499),
("FM-FT5", "Fitness Maker", "FT-5 Functional Trainer", "gym", 2, 1115, 2999),

("WF-RW3", "Water Front Designs", "RW-3 Rower", "rower", 15, 240, 599),
("WF-RW5", "Water Front Designs", "RW-5 Rower", "rower", 12, 400, 999),
("SM-SB3", "Spinning Masters INC", "SB-3 Spinning Bike", "bike", 15, 175, 399),
("SM-SB5", "Spinning Masters INC", "SB-5 Spinning Bike", "bike", 22, 245, 499);

SELECT * FROM products;
