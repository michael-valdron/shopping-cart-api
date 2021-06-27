import { ItemJson } from "../schemas/item";
import * as util from "../util";

export default class Item {
    private _id: number | null;
    private _cartId: number;
    private _label: string;
    private _price: number;

    static fromJson(json: ItemJson): Item {
        return new Item(
            json.cart_id, 
            json.item_label, 
            Number.parseFloat(json.item_price), 
            json.item_id
        );
    }

    constructor(cartId: number, label: string, price: number, id: number | null = null) {
        this._id = id;
        this._cartId = cartId;
        this._label = label;
        this._price = price;
    }

    /**
     * toJson
     */
     public toJson(): any {
        return {
            id: this._id,
            cartId: this.cartId,
            label: this._label,
            price: util.roundTo(this._price, 2)
        }
    }
    
    public get id(): number {
        return this._id;
    }
    
    public get cartId(): number {
        return this._cartId;
    }
    
    public get label(): string {
        return this._label;
    }
    
    public get price(): number {
        return this._price;
    }
    
    public set id(v: number) {
        this._id = v;
    }
    
    public set cartId(v: number) {
        this._cartId = v;
    }
    
    public set label(v: string) {
        this._label = v;
    }
    
    public set price(v: number) {
        this._price = v;
    }
}