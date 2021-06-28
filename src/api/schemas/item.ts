/**
 * Type of JSON object recieved by `pg` driver for {@link Item} entities
 * @see Item
 * @see ItemDao
 */
export type ItemJson = {
    item_id: number,
    cart_id: number,
    item_label: string,
    item_price: string
}
