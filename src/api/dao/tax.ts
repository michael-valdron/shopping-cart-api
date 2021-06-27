import { Pool, PoolConfig } from "pg";
import Dao from ".";
import * as util from "./util";
import { TaxJson } from "../schemas/tax";
import Tax from "../model/tax";

type TaxParams = {
    label?: string,
    percent?: number
};

export default class TaxDao implements Dao<Tax> {
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

    read(id: number): Promise<Tax> {
        return new Promise<Tax>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            
            if (client) {
                const result = await client.query<TaxJson>(
                    'SELECT * FROM tax WHERE tax_id=$1;',
                    [id]  
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Tax.fromJson(result.rows[0]));
                }
            }
        });
    }

    readAll(): Promise<Tax[]> {
        return new Promise<Tax[]>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            if (client) {
                const result = await client.query<TaxJson>('SELECT * FROM tax;').catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve([]);
                    else
                        resolve(result.rows.map(Tax.fromJson));
                }
            }
        });
    }

    create(tax: Tax): Promise<Tax> {
        return new Promise<Tax>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));

            if (client) {
                const result = await client.query<TaxJson>(
                    `
                        INSERT INTO tax(
                            tax_label, tax_percent
                        ) VALUES (
                            $1, $2
                        )
                        RETURNING *;
                    `,
                    [tax.label, tax.percent]
                ).catch((err) => util.query_err(err, reject));

                if (result) resolve(Tax.fromJson(result.rows[0]));
            }
        });
    }

    update(tax: Tax, params: TaxParams): Promise<Tax> {
        return new Promise<Tax>(async (resolve, reject) => {
            const attrs: string[] = Object.keys(params)
                .map((k) => `tax_${k}`); // Add prefix
            
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));
            
            if (client) {
                const result = await client.query<TaxJson>(
                    `
                        UPDATE tax
                        SET ${util.buildUpdateSetStr(attrs)}
                        WHERE tax_id = \$${attrs.length+1}
                        RETURNING *;
                    `,
                    [...Object.values(params), tax.id]
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Tax.fromJson(result.rows[0]));
                }
            }
        });
    }

    delete(tax: Tax): Promise<Tax> {
        return new Promise<Tax>(async (resolve, reject) => {
            const client = await this._pool.connect().catch((err) => util.connect_error(err, reject));

            if (client) {
                const result = await client.query<TaxJson>(
                    `
                        DELETE FROM tax
                        WHERE tax_id = $1
                        RETURNING *;
                    `,
                    [tax.id]
                ).catch((err) => util.query_err(err, reject));

                if (result) {
                    if (result.rowCount === 0)
                        resolve(null);
                    else
                        resolve(Tax.fromJson(result.rows[0]));
                }
            }
        });
    }
}