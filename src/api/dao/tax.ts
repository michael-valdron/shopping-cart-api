import { Pool, PoolConfig } from "pg";
import Dao from ".";
import * as util from "./util";
import { TaxJson } from "../schemas/tax";
import Tax from "../model/tax";

/**
 * Type of JSON object used for updating a `Tax` entity in the database
 */
type TaxParams = {
    label?: string,
    percent?: number
};

/**
 * Data access object class for `Tax` model entity
 */
export default class TaxDao implements Dao<Tax> {
    private _pool: Pool;

    /**
     * Create a `Tax` data access object.
     */
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

    /**
     * Queries for a tax record with a given `id`.
     * 
     * @param id - Unique identifier for a tax record to aquire.
     * @returns a `Tax` model entity for resultant record, `null` if none found.
     */
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

    /**
     * Queries for all forms of taxes stored in database.
     * 
     * @returns A collection of `Tax` model entities.
     */
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

    /**
     * Creates a new record in database provided by given `Tax` entity.
     * 
     * @param tax - A new `Tax` entity to create in database.
     * @returns a `Tax` entity of the newly created record.
     */
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

    /**
     * Updates record attributes to values specified in `params`, record is aquired by `id` field
     * in given `Tax` entity.
     * 
     * @param tax - `Tax` entity to be updated.
     * @param params - JSON object with specified fields to be updated with new values.
     * @returns the updated `Tax` entity, `null` if no record is found.
     */
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

    /**
     * Deletes tax record in database for given `Tax` entity, record is aquired by `id` field
     * in given `Tax` entity.
     * 
     * @param tax - `Tax` entity to be deleted from database.
     * @returns the deleted `Tax` entity, `null` if no record is found.
     */
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