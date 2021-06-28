/**
 * Builds the attibute-value assignment placeholder string
 * for the `SET` portion of a SQL `UPDATE` query.
 * 
 * @param attrs - Attributes to be set in `UPDATE` query.
 * @returns string value of the series of assignments to be placed 
 * in the `SET` portion of an `UPDATE` query.
 */
export function buildUpdateSetStr(attrs: string[]): string {
    return attrs
        .map((attr, idx) => `${attr} = \$${idx+1}`)
        .join(', ');
}

/**
 * Builds error message for database connection errors.
 * 
 * @param err - error object from database driver to be logged.
 * @param reject - rejection function for a returned promise.
 */
export function connect_error(err: any, reject: (reason?: any) => void) {
    reject(`Database connection error: ${err}`);
}

/**
 * Builds error message for database query errors.
 * 
 * @param err - error object from database driver to be logged.
 * @param reject - rejection function for a returned promise.
 */
export function query_err(err: any, reject: (reason?: any) => void) {
    reject(`Database query error: ${err}`);
}
