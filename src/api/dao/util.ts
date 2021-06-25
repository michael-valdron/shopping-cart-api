export function buildUpdateSetStr(attrCount: number): string {
    const ids = Array.from({length: attrCount}, (_, i) => 
        i + 1
    );

    return ids
        .map((idx) => `\$${idx} = \$${idx+attrCount}`)
        .join(', ');
}

export function connect_error(err: any, reject: (reason?: any) => void) {
    reject(`Database connection error: ${err}`);
}

export function query_err(err: any, reject: (reason?: any) => void) {
    reject(`Database query error: ${err}`);
}