export const OK_RESPONSE = {
    "status": "ok"
};
export const DB_ERROR_RESPONSE = {
    "status": "error",
    "message": "Database error."
};

export function roundTo(n: number, r: number): number {
    const d = Math.pow(10, r);
    return Math.round(n * d) / d; 
}