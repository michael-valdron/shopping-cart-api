/**
 * Interface for all data access object classes.
 */
export interface Dao<T> {
    /**
     * Queries for an entity `T` with a given `id`.
     * 
     * @param id - Unique identifier for a record to aquire.
     */
    read(id: number): Promise<T>;

    /**
     * Queries for all records of entity `T` stored in database.
     * 
     * @returns A collection of `T` model entities.
     */
    readAll(): Promise<T[]>;

    /**
     * Creates a new record in database provided by given `T` entity.
     * 
     * @param entity - A new `T` entity to create in database.
     * @returns a `T` entity of the newly created record.
     */
    create(entity: T): Promise<T>;

    /**
     * Updates record attributes to values specified in `params` for a 
     * given `T` entity.
     * 
     * @param entity - `T` entity to be updated.
     * @param params - JSON object with specified fields to be updated with new values.
     * @returns the updated `T` entity, `null` if no record is found.
     */
    update(entity: T, params: Object): Promise<T>;

    /**
     * Deletes a record in database for given `T` entity.
     * 
     * @param cart - `T` entity to be deleted from database.
     * @returns the deleted `T` entity, `null` if no record is found.
     */
    delete(entity: T): Promise<T>;
}
