import { ItemJson } from "../schemas/item";
import * as util from "../util";

export default class Item {
    private _id?: number;
    private _cartId: number;
    private _label: string;
    private _price: number;

    /**
     * Converts a JSON record result from `pg` query to a `Item` model entity.
     * 
     * @param json A `Item` JSON object from `pg` driver
     * @returns `Item` model entity.
     */
    static fromJson(json: ItemJson): Item {
        return new Item(
            json.cart_id, 
            json.item_label, 
            Number.parseFloat(json.item_price), 
            json.item_id
        );
    }

    /**
     * Create a `Item` model entity.
     * 
     * @param cartId - Unique identifier for associated cart record
     * @param label - A text label to uniquely describe the item
     * @param price - Price of item
     * @param id - (Optional) unique identifier of the `Item`, required for accessing existing `Item` in database
     */
    constructor(cartId: number, label: string, price: number, id?: number) {
        this._id = id;
        this._cartId = cartId;
        this._label = label;
        this._price = price;
    }

    /**
     * Creates a JSON object repersentation of `Item` entity.
     * 
     * @returns JSON object repersentation of `Item` entity
     */
     public toJson(): any {
        return {
            id: this._id,
            cartId: this.cartId,
            label: this._label,
            price: util.roundTo(this._price, 2)
        }
    }
    
    /**
     * returns `Item` unique identifier.
     */
    public get id(): number {
        return this._id;
    }
    
    /**
     * returns unique identifier for attached `Cart`.
     */
    public get cartId(): number {
        return this._cartId;
    }
    
    /**
     * returns label for `Item`
     */
    public get label(): string {
        return this._label;
    }
    
    /**
     * returns the price of `Item`
     */
    public get price(): number {
        return this._price;
    }
    
    /**
     * sets `Item` unique identifier.
     */
    public set id(v: number) {
        this._id = v;
    }
    
    /**
     * sets unique identifier for attached `Cart`.
     */
    public set cartId(v: number) {
        this._cartId = v;
    }
    
    /**
     * sets label for `Item`
     */
    public set label(v: string) {
        this._label = v;
    }
    
    /**
     * sets the price of `Item`
     */
    public set price(v: number) {
        this._price = v;
    }
}