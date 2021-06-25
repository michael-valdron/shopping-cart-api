import { CartJson } from "../schemas/cart";
import * as util from "../util";

export default class Cart {
    private _id: number | null;
    private _subtotal: number;
    private _discount: number;
    private _taxes: number;
    private _total: number;

    static fromJson(json: CartJson): Cart {
        return new Cart(json.cart_subtotal, json.cart_discount, json.cart_taxes, json.cart_total, json.cart_id);
    }

    constructor(subtotal: number, discount: number, taxes: number, total: number, id: number | null = null) {
        this._id = id;
        this._subtotal = subtotal;
        this._discount = discount;
        this._taxes = taxes;
        this._total = total;
    }

    /**
     * toJson
     */
    public toJson(): any {
        return {
            subtotal: util.roundTo(this._subtotal, 2),
            discount: util.roundTo(this._discount, 2),
            taxes: util.roundTo(this._taxes, 2),
            total: util.roundTo(this._total, 2)
        }
    }

    public get id(): number | null {
        return this._id;
    }
    
    public get subtotal(): number {
        return this._subtotal;
    }
    
    public get discount(): number {
        return this._discount;
    }

    public get taxes(): number {
        return this._taxes;
    }
    
    public get total(): number {
        return this._total;
    }
    
    public set id(v: number) {
        this._id = v;
    }
    
    public set subtotal(v: number) {
        this._subtotal = v;
    }

    public set discount(v: number) {
        this._discount = v;
    }
    
    public set taxes(v: number) {
        this._taxes = v;
    }
    
    public set total(v: number) {
        this._total = v;
    }
}
