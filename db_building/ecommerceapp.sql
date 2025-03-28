CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email_adress VARCHAR(100) NOT NULL,
    phone_number VARCHAR(10),
    created_at DATETIME NOT NULL
);

create table admin_users (
    id int primary key auto_increment, 
    username varchar(100) not null unique,
    password varchar(100) not null
);

CREATE TABLE addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    street_number INT NOT NULL,
    street VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(5) NOT NULL,
    customer INT NOT NULL,
    FOREIGN KEY (customer) REFERENCES customers (customer_id) ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    products_in_category INT DEFAULT 0
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    stock INT NOT NULL,
    price FLOAT NOT NULL,
    description VARCHAR(500),
    image VARCHAR(100),
    rating FLOAT NOT NULL,
    is_available INT NOT NULL,
    category INT NOT NULL,
    FOREIGN KEY (category) REFERENCES categories (category_id) ON DELETE CASCADE
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    from_customer INT DEFAULT NULL,
    total_price FLOAT NOT NULL DEFAULT 0,
    to_address INT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (from_customer) REFERENCES customers (customer_id) ON DELETE SET NULL,
    FOREIGN KEY (to_address) REFERENCES addresses (address_id) ON DELETE SET NULL
);

CREATE TABLE products_in_orders(
    order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE carts (
    cart_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    belongs_to INT NOT NULL,
    total_price FLOAT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (belongs_to) REFERENCES customers (customer_id) ON DELETE CASCADE
);

CREATE TABLE products_in_carts(
    cart_id INTEGER REFERENCES carts(cart_id),
    product_id INTEGER REFERENCES products(product_id),
    PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    from_client INT DEFAULT NULL,
    for_order INT DEFAULT NULL,
    is_fulfilled INT NOT NULL,
    fulfilled_at DATETIME,
    FOREIGN KEY (from_client) REFERENCES customers (customer_id) ON DELETE SET NULL,
    FOREIGN KEY (for_order) REFERENCES orders (order_id) ON DELETE SET NULL
);

INSERT INTO customers (firstname, lastname, email_adress, phone_number, created_at) 
    VALUES 
    ('jean', 'pierre', 'jean@pierre.com', '123456789', NOW()),
    ('claude', 'jean', 'claude@jean.com', '78908721', NOW()),
    ('john', 'doe', 'johndoe@gmail.com', '0102030405', NOW()),
    ('toto', 'tata', 'tota@free.fr', '0689675423', NOW()),
    ('salut', 'lol', 'salol@outlook.fr', '123490876', NOW())
;

INSERT INTO addresses (street_number, street, postal_code, city, country, customer)
    VALUES
    (1, 'rue des plantes', 75006, 'paris', 'FRA', 1),
    (28, 'rue des arbres', 75007, 'paris', 'FRA', 2),
    (2, 'rue de la paix', 75008, 'paris', 'FRA', 2),
    (230, 'rue de oui', 13000, 'marseille', 'FRA', 3),
    (3, 'rue des plantes', 75006, 'paris', 'FRA', 4),
    (5, 'rue des noms', 33000, 'bordeaux', 'FRA', 5),
    (4, 'avenue des champs elysées', 75008, 'paris', 'FRA', 5)
;

INSERT INTO categories (name, description)
    VALUES
    ('vêtements', 'découvrez notre sélection de vêtements!'),
    ('livres', 'tous les livres auxquels vous pouvez penser sont sur notre site!'),
    ('informatique', "notre séléction d'appareils informatique est la meilleure du marché")
;

INSERT INTO products (name, stock, price, description, image, rating, is_available, category)
    VALUES 
    ('t-shirt rose', 20, 15.99, 'un magnifique t shirt rose', 'tshirt.jpg', 4.2, 1, 1),
    ('jean noir', 5, 79.99, '', 'jean.png', 3.2, 1, 1),
    ('pull vert fluo', 0, 208.5, 'notre best seller! ne passez pas à côté de ce produit!', 'fluo.png', 5.0, 0, 1),
    ('le temps des tempêtes', 999, 10.0, "vous avez écouté l'audiobook ? n'hésitez pas à acheter la version materielle ;)", 'sarkoenculé.png', 1.2, 1, 2),
    ('le seigneur des anneaux intégrale', 0, 30.99, 'gandalf', 'golum.jpg', 4.6, 0, 2),
    ('harry potter', 18, 22.99, "n'achetez surtout pas ce livre l'autrice est une grosse transphobe!!!!!!", 'transrights.png', 2.6, 1, 2),
    ('macbook pro puce m4', 30, 2399.00, '', 'apple.jpeg', 4.1, 1, 3),
    ('nvidia geforce 10090 ti pro max turbo fusion gtr', 4, 5668.99, 'nouvelle carte graphique surpuissante, le strict minimum pour jouer à minecraft!!! ;)', 'nvidia.jpg', 4.8, 1, 3),
    ('clavier mechanique custom', 2, 299.00, 'switchs lubrifiés foam intégré dans la case, clavier 75% disponible dans tous les layouts du monde avec keycaps en pcb!!', 'superbeclavier.png', 4.9, 1, 3)
;

UPDATE categories
SET products_in_category = (SELECT COUNT(name) FROM products WHERE category = 1)
WHERE category_id = 1;

UPDATE categories
SET products_in_category = (SELECT COUNT(name) FROM products WHERE category = 2)
WHERE category_id = 2;

UPDATE categories
SET products_in_category = (SELECT COUNT(name) FROM products WHERE category = 3)
WHERE category_id = 3;

INSERT INTO orders (from_customer, to_address, created_at)
    VALUES
    (1, 1, NOW()),
    (2, 3, NOW()),
    (5, 7, NOW())
;

INSERT INTO products_in_orders (order_id, product_id)
    VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 7),
    (2, 9),
    (3, 4),
    (3, 6)
;

UPDATE orders
SET total_price = (
    SELECT SUM(price)
    FROM products
    INNER JOIN products_in_orders ON products_in_orders.order_id = 1 
    AND products.product_id = products_in_orders.product_id
)
WHERE order_id = 1;

UPDATE orders
SET total_price = (
    SELECT SUM(price)
    FROM products
    INNER JOIN products_in_orders ON products_in_orders.order_id = 2 
    AND products.product_id = products_in_orders.product_id
)
WHERE order_id = 2;

UPDATE orders
SET total_price = (
    SELECT SUM(price)
    FROM products
    INNER JOIN products_in_orders ON products_in_orders.order_id = 3 
    AND products.product_id = products_in_orders.product_id
)
WHERE order_id = 3;

INSERT INTO payments (from_client, for_order, is_fulfilled, fulfilled_at)
    VALUES
    ((SELECT from_customer FROM orders WHERE order_id = 1), 1, 0, NULL),
    ((SELECT from_customer FROM orders WHERE order_id = 2), 2, 1, NOW()),
    ((SELECT from_customer FROM orders WHERE order_id = 3), 3, 1, NOW())
;