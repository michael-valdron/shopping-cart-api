/**
 * Type of JSON object recieved by `pg` driver for `Cart` entities
 */
export type CartJson = {
    cart_id: number,
    cart_subtotal: string,
    cart_discount: string,
    cart_taxes: string,
    cart_total: string
}
