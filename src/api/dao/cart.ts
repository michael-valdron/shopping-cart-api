import { Pool } from "pg";
import Dao from ".";
import * as util from "./util";
import Cart from "../model/cart";
import { CartJson } from "../schemas/cart";

export type CartParams = {
    subtotal?: number,
    discount?: number,
    taxes?: number,
    total?: number
}

export default class CartDao implements Dao<Cart> {
    private _pool: Pool;

    constructor() {
        this._pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });
    }

    read(id: number): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            
            if (client) {
                const result = await client.query<CartJson>(
                    'SELECT * FROM carts WHERE cart_id=$1;',
                    [id]  
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Cart.fromJson(result.rows[0]));
                }
            }
        });
    }

    readAll(): Promise<Cart[]> {
        return new Promise<Cart[]>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            if (client) {
                const result = await client.query<CartJson>('SELECT * FROM carts;').catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve([]);
                    else
                        resolve(result.rows.map(Cart.fromJson));
                }
            }
        });
    }

    create(cart: Cart): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));

            if (client) {
                const result = await client.query<CartJson>(
                    `
                        INSERT INTO carts(
                            cart_subtotal, cart_discount, cart_taxes,
                            cart_total
                        ) VALUES (
                            $1, $2, $3, $4
                        )
                        RETURNING *;
                    `,
                    [cart.subtotal, cart.discount, cart.taxes, cart.total]
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Cart.fromJson(result.rows[0]));
                }
            }
        });
    }

    update(cart: Cart, params: CartParams): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            const attrs: string[] = Object.keys(params)
                .map((k) => `cart_${k}`); // Add prefix
            
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            
            if (client) {
                const result = await client.query<CartJson>(
                    `
                        UPDATE carts
                        SET ${util.buildUpdateSetStr(attrs)}
                        WHERE cart_id = \$${attrs.length+1}
                        RETURNING *;
                    `,
                    [...Object.values(params), cart.id]
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Cart.fromJson(result.rows[0]));
                }
            }
        });
    }

    delete(cart: Cart): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));

            if (client) {
                const result = await client.query<CartJson>(
                    `
                        DELETE FROM carts
                        WHERE cart_id = $1
                        RETURNING *;
                    `,
                    [cart.id]
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Cart.fromJson(result.rows[0]));
                }
            }
        });
    }
}