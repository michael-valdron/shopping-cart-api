import { Pool, PoolConfig } from "pg";
import { Dao } from ".";
import * as util from "./util";
import { Item } from "../model/item";
import { ItemJson } from "../schemas/item";

/**
 * Type of JSON object used for updating an {@link Item} entity in the database
 * @see ItemDao
 */
export type ItemParams = {
    label?: string,
    price?: number
}

/**
 * Data access object ({@link Dao}) class for {@link Item} model entity
 * @see Dao
 */
export class ItemDao implements Dao<Item> {
    private _pool: Pool;

    /**
     * Create an {@link Item} data access object.
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
     * Queries for an item with a given `id`.
     * 
     * @param id - Unique identifier for an item to acquire.
     * @returns a {@link Item} model entity for resultant record, `null` if none found.
     */
    read(id: number): Promise<Item> {
        return new Promise<Item>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            if (client) {
                const result = await client.query<ItemJson>(
                    'SELECT * FROM items WHERE item_id=$1;',
                    [id]
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Item.fromJson(result.rows[0]));
                }
            }
        });
    }

    /**
     * Queries for all items stored in database.
     * 
     * @returns A collection of {@link Item} model entities.
     */
    readAll(): Promise<Item[]> {
        return new Promise<Item[]>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            if (client) {
                const result = await client.query<ItemJson>('SELECT * FROM items;').catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve([]);
                    else
                        resolve(result.rows.map(Item.fromJson));
                }
            }
        });
    }

    /**
     * Creates a new record in database provided by given {@link Item} entity.
     * 
     * @param item - A new {@link Item} entity to create in database.
     * @returns an {@link Item} entity of the newly created record.
     */
    create(item: Item): Promise<Item> {
        return new Promise<Item>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            if (client) {
                const result = await client.query<ItemJson>(
                    `
                        INSERT INTO items(
                            cart_id, item_label, item_price
                        ) VALUES (
                            $1, $2, $3
                        )
                        RETURNING *;
                    `,
                    [item.cartId, item.label, item.price]
                ).catch((err) => util.query_err(err, reject));
                
                if (result) resolve(Item.fromJson(result.rows[0]));
            }
        });
    }

    /**
     * Updates record attributes to values specified in `params`, record is acquired by `id` field
     * in given {@link Item} entity.
     * 
     * @param item - {@link Item} entity to be updated.
     * @param params - JSON object with specified fields to be updated with new values.
     * @returns the updated {@link Item} entity, `null` if no record is found.
     */
    update(item: Item, params: ItemParams): Promise<Item> {
        return new Promise<Item>(async (resolve, reject) => {
            const attrs: string[] = Object.keys(params)
                .map((k) => `item_${k}`); // Add prefix
            
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            
            if (client) {
                const result = await client.query<ItemJson>(
                    `
                        UPDATE items
                        SET ${util.buildUpdateSetStr(attrs)}
                        WHERE item_id = \$${attrs.length+1}
                        RETURNING *;
                    `,
                    [...Object.values(params), item.id]
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Item.fromJson(result.rows[0]));
                }
            }
        });
    }

    /**
     * Deletes item record in database for given {@link Item} entity, record is acquired by `id` field
     * in given {@link Item} entity.
     * 
     * @param item - {@link Item} entity to be deleted from database.
     * @returns the deleted {@link Item} entity, `null` if no record is found.
     */
    delete(item: Item): Promise<Item> {
        return new Promise<Item>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));

            if (client) {
                const result = await client.query<ItemJson>(
                    `
                        DELETE FROM items
                        WHERE item_id = $1
                        RETURNING *;
                    `,
                    [item.id]
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Item.fromJson(result.rows[0]));
                }
            }
        });
    }
}