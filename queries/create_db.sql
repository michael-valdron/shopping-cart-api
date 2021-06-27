-- Author: Michael Valdron
-- For local dev use

-- Creates shopping cart database for storing records on
-- carts and cart items.
CREATE DATABASE shopping_cart;

-- Use 'shopping_cart' database
\c shopping_cart;

-- Creates carts relation to store all cart records.
CREATE TABLE IF NOT EXISTS carts(
    cart_id SERIAL PRIMARY KEY,
    cart_subtotal NUMERIC NOT NULL,
    cart_discount NUMERIC NOT NULL,
    cart_taxes NUMERIC NOT NULL,
    cart_total NUMERIC NOT NULL
);

-- Creates items relation to store all item records.
-- Each item references a cart.
CREATE TABLE IF NOT EXISTS items(
    item_id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    item_label VARCHAR(255) NOT NULL,
    item_price NUMERIC NOT NULL,
    UNIQUE (cart_id, item_label),
    CONSTRAINT fk_cart
        FOREIGN KEY(cart_id)
        REFERENCES carts(cart_id)
        ON DELETE CASCADE
);

-- Creates tax relation to store all tax percentages.
CREATE TABLE IF NOT EXISTS tax(
    tax_id SERIAL PRIMARY KEY,
    tax_label VARCHAR(3) UNIQUE NOT NULL,
    tax_percent NUMERIC NOT NULL
);
