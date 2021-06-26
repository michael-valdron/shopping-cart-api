import { TaxJson } from "../schemas/tax";

export default class Tax {
    private _id: number | null;
    private _label: string;
    private _percent: number;

    public static fromJson(json: TaxJson): Tax {
        return new Tax(
            json.tax_label, 
            Number.parseFloat(json.tax_percent), 
            json.tax_id
        );
    }

    constructor(label: string, percent: number, id?: number) {
        this.id = id;
        this.label = label;
        this.percent = percent;
    }
    
    public get id(): number {
        return this._id;
    }
    
    public get label(): string {
        return this._label;
    }
    
    public get percent(): number {
        return this._percent;
    }
    
    public set id(v: number) {
        this._id = v;
    }
    
    public set label(v: string) {
        this._label = v;
    }
    
    public set percent(v: number) {
        this._percent = v;
    }
}