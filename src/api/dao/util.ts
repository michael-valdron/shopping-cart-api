export function buildUpdateSetStr(attrs: string[]): string {
    return attrs
        .map((attr, idx) => `${attr} = \$${idx+1}`)
        .join(', ');
}

export function connect_error(err: any, reject: (reason?: any) => void) {
    reject(`Database connection error: ${err}`);
}

export function query_err(err: any, reject: (reason?: any) => void) {
    reject(`Database query error: ${err}`);
}