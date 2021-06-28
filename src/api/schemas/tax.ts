/**
 * Type of JSON object recieved by `pg` driver for `Tax` entities
 */
export type TaxJson = {
    tax_id: number,
    tax_label: string,
    tax_percent: string
}
