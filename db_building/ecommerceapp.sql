
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
    FOREIGN KEY (customer) REFERENCES customers (customer_id)
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
    FOREIGN KEY (category) REFERENCES categories (category_id)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    from_customer INT NOT NULL,
    total_price FLOAT NOT NULL DEFAULT 0,
    to_address INT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (from_customer) REFERENCES customers (customer_id),
    FOREIGN KEY (to_address) REFERENCES addresses (address_id)
);

CREATE TABLE products_in_orders(
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE carts (
    cart_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    belongs_to INT NOT NULL,
    total_price FLOAT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (belongs_to) REFERENCES customers (customer_id)
);

CREATE TABLE products_in_carts(
    cart_id INTEGER REFERENCES carts(cart_id),
    product_id INTEGER REFERENCES products(product_id),
    PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    from_client INT NOT NULL,
    for_order INT NOT NULL,
    is_fulfilled INT NOT NULL,
    fulfilled_at DATETIME,
    FOREIGN KEY (from_client) REFERENCES customers (customer_id),
    FOREIGN KEY (for_order) REFERENCES orders (order_id)
);