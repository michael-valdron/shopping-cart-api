/**
 * Type of JSON object recieved by `pg` driver for `Item` entities
 */
export type ItemJson = {
    item_id: number,
    cart_id: number,
    item_label: string,
    item_price: string
}
