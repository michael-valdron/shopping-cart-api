/**
 * A generic 200 ok JSON response.
 */
export const OK_RESPONSE = {
    "status": "ok"
};

/**
 * A generic database 500 error JSON response.
 */
export const DB_ERROR_RESPONSE = {
    "status": "error",
    "message": "Database error."
};

/**
 * Creates a JSON response for when errors are thrown.
 * 
 * @param message - Error message
 * @returns JSON response `Object`.
 */
export function errorResponse(message: string) {
    return {
        "status": "error",
        "message": message
    };
}

/**
 * Rounds a given number to a given number of decimal points.
 * 
 * @param n - Number to round
 * @param r - Number of decimal points to round to
 * @returns Rounded `number` of `n`
 */
export function roundTo(n: number, r: number): number {
    const d = Math.pow(10, r);
    return Math.round(n * d) / d; 
}