import { TaxJson } from "../schemas/tax";

/**
 * Model entity for a form of tax.
 */
export default class Tax {
    private _id?: number;
    private _label: string;
    private _percent: number;

    /**
     * Converts a JSON record result from `pg` query to a `Tax` model entity.
     * 
     * @param json - A `Tax` JSON object from `pg` driver
     * @returns `Tax` model entity.
     */
    public static fromJson(json: TaxJson): Tax {
        return new Tax(
            json.tax_label, 
            Number.parseFloat(json.tax_percent), 
            json.tax_id
        );
    }

    /**
     * Create a `Tax` model entity.
     * 
     * @param label - 3-letter identifier for tax percentage.
     * @param percent - Percentage value of tax.
     * @param id - (Optional) unique identifier of the `Tax`, required for accessing existing `Tax` in database
     */
    constructor(label: string, percent: number, id?: number) {
        this.id = id;
        this.label = label;
        this.percent = percent;
    }
    
    /**
     * returns `Tax` unique identifier.
     */
    public get id(): number {
        return this._id;
    }
    
    /**
     * returns 3-letter identifier for tax percentage.
     */
    public get label(): string {
        return this._label;
    }
    
    /**
     * returns percentage value of tax.
     */
    public get percent(): number {
        return this._percent;
    }
    
    /**
     * sets `Tax` unique identifier.
     */
    public set id(v: number) {
        this._id = v;
    }
    
    /**
     * sets 3-letter identifier for tax percentage.
     */
    public set label(v: string) {
        this._label = v;
    }
    
    /**
     * sets percentage value of tax.
     */
    public set percent(v: number) {
        this._percent = v;
    }
}