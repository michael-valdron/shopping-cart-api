import { CartJson } from "../schemas/cart";
import * as util from "../util";

/**
 * Model entity for a shopping cart.
 */
export class Cart {
    private _id?: number;
    private _subtotal: number;
    private _discount: number;
    private _taxes: number;
    private _total: number;

    /**
     * Calculates the total price of a cart.
     * 
     * @param subtotal - Subtotal amount of cart
     * @param tax - Tax amount of cart
     * @param discount - Discount percentage to apply
     * @returns The total price of a cart after tax and discount is applied.
     */
    static calcTotalPrice = (subtotal: number, tax: number, discount: number): number =>
        (subtotal+tax)-((subtotal+tax)*discount);

    /**
     * Converts a JSON record result from `pg` query to a {@link Cart} model entity.
     * 
     * @param json - A {@link Cart} JSON object from `pg` driver
     * @returns A {@link Cart} model entity.
     * @see CartDao
     */
    static fromJson = (json: CartJson): Cart =>
        new Cart(
            Number.parseFloat(json.cart_subtotal), 
            Number.parseFloat(json.cart_discount), 
            Number.parseFloat(json.cart_taxes),
            Number.parseFloat(json.cart_total), 
            json.cart_id);

    /**
     * Create a {@link Cart} model entity.
     * 
     * @param subtotal - subtotal of {@link Cart}
     * @param discount - discount percent to be applied subtotal of the {@link Cart}
     * @param taxes - total tax amount to be applied to {@link Cart}
     * @param total - (Optional) total price of the {@link Cart} with taxes and discount applied, if not specified will be calculated 
     * from `subtotal`, `discount` and `taxes`
     * @param id - (Optional) unique identifier of the {@link Cart}, required for accessing existing {@link Cart} in database
     */
    constructor(subtotal: number, discount: number, taxes: number, total?: number, id?: number) {
        this._id = id;
        this._subtotal = subtotal;
        this._discount = discount;
        this._taxes = taxes;
        this._total = (typeof total !== 'number') ? Cart.calcTotalPrice(subtotal, taxes, discount) : total;
    }

    /**
     * Creates a JSON object repersentation of {@link Cart} entity.
     * 
     * @returns JSON object repersentation of {@link Cart} entity
     */
    public toJson(): any {
        return {
            id: this._id,
            subtotal: util.roundTo(this._subtotal, 2),
            discount: util.roundTo(this._discount, 2),
            taxes: util.roundTo(this._taxes, 2),
            total: util.roundTo(this._total, 2)
        }
    }

    /**
     * returns {@link Cart} unique identifier.
     */
    public get id(): number {
        return this._id;
    }
    
    /**
     * returns the subtotal of the {@link Cart}.
     */
    public get subtotal(): number {
        return this._subtotal;
    }
    
    /**
     * returns the discounted percent of the {@link Cart}.
     */
    public get discount(): number {
        return this._discount;
    }
    
    /**
     * returns the total tax amount of the {@link Cart}.
     */
    public get taxes(): number {
        return this._taxes;
    }
    
    /**
     * returns the total price of the {@link Cart}.
     */
    public get total(): number {
        return this._total;
    }
    
    /**
     * sets {@link Cart} unique identifier.
     */
    public set id(v: number) {
        this._id = v;
    }
    
    /**
     * sets the subtotal of the {@link Cart}.
     */
    public set subtotal(v: number) {
        this._subtotal = v;
    }

    /**
     * sets the discounted percent of the {@link Cart}.
     */
    public set discount(v: number) {
        this._discount = v;
    }
    
    /**
     * sets the total tax amount of the {@link Cart}.
     */
    public set taxes(v: number) {
        this._taxes = v;
    }

    /**
     * sets the total price of the {@link Cart}.
     */
    public set total(v: number) {
        this._total = v;
    }
}
