export default interface Dao<T> {
    read(param: number): Promise<T>;
    readAll(): Promise<T[]>;
    create(entity: T): Promise<T>;
    update(entity: T, params: Object): Promise<T>;
    delete(entity: T): Promise<T>;
}
