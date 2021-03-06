import { Pool, PoolConfig } from "pg";
import { Dao } from ".";
import * as util from "./util";
import { Cart } from "../model/cart";
import { CartJson } from "../schemas/cart";

/**
 * Type of JSON object used for updating a {@link Cart} entity in the database.
 * @see CartDao
 */
export type CartParams = {
    subtotal?: number,
    discount?: number,
    taxes?: number,
    total?: number
}

/**
 * Data access object ({@link Dao}) class for {@link Cart} model entity
 * @see Dao
 */
export class CartDao implements Dao<Cart> {
    private _pool: Pool;

    /**
     * Create a {@link Cart} data access object.
     */
    constructor() {
        const ssl: PoolConfig = (process.env.DATABASE_SSL) ? {
            ssl: {
                rejectUnauthorized: false
            }
        } : {};
        this._pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ...ssl
        });
    }

    /**
     * Queries for a cart with a given `id`.
     * 
     * @param id - Unique identifier for a cart to acquire.
     * @returns a {@link Cart} model entity for resultant record, `null` if none found.
     */
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

    /**
     * Queries for all carts stored in database.
     * 
     * @returns A collection of {@link Cart} model entities.
     */
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

    /**
     * Creates a new record in database provided by given {@link Cart} entity.
     * 
     * @param cart - A new {@link Cart} entity to create in database.
     * @returns a {@link Cart} entity of the newly created record.
     */
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

    /**
     * Updates record attributes to values specified in `params`, record is acquired by `id` field
     * in given {@link Cart} entity.
     * 
     * @param cart - {@link Cart} entity to be updated.
     * @param params - JSON object with specified fields to be updated with new values.
     * @returns the updated {@link Cart} entity, `null` if no record is found.
     */
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

    /**
     * Deletes cart record in database for given {@link Cart} entity, record is acquired by `id` field
     * in given {@link Cart} entity.
     * 
     * @param cart - {@link Cart} entity to be deleted from database.
     * @returns the deleted {@link Cart} entity, `null` if no record is found.
     */
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