/**
 * Type of JSON object recieved by `pg` driver for {@link Tax} entities
 * @see Tax
 * @see TaxDao
 */
export type TaxJson = {
    tax_id: number,
    tax_label: string,
    tax_percent: string
}
