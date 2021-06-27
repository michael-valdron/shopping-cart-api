import { Pool, PoolConfig } from "pg";
import Dao from ".";
import * as util from "./util";
import Item from "../model/item";
import { ItemJson } from "../schemas/item";

export type ItemParams = {
    label?: string,
    price?: number
}

export default class ItemDao implements Dao<Item> {
    private _pool: Pool;

    constructor() {
        const ssl: PoolConfig = (process.env.SSL) ? {
            ssl: {
                rejectUnauthorized: false
            }
        } : {};
        this._pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ...ssl
        });
    }

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