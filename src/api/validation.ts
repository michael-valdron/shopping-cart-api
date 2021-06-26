
const validatePercent = (p: any): boolean => typeof p === 'number' && p >= 0 && p <= 1;

/**
 * Validates data input for adding a cart with items.
 * 
 * @param body 
 * @returns `true` if valid input data for a new cart, `false` if invalid.
 */
export function validateAddCartInput(body: any): boolean {
    const VALID_BODY_KEYS = ['discount', 'items']; // Valid keys for main body object
    const VALID_ITEM_KEYS = ['label', 'price']; // Valid keys for item objects

    // Body is Object typed and every key is valid.
    if (typeof body !== 'object' || !Object.keys(body).every((k) => VALID_BODY_KEYS.includes(k)))
        return false;
    // If optional discount exists then must be valid percent value.
    else if (body.discount && !validatePercent(body.discount))
        return false;
    // Items must be an array.
    else if (!Array.isArray(body.items))
        return false;

    const items = body.items as any[];

    for (const item of items) {
        // Every item must be an object and must only include valid keys.
        if (typeof item !== 'object' || !Object.keys(item).every((k) => VALID_ITEM_KEYS.includes(k)))
            return false;
        
        // Every item must have a label as a string and a price as a number.
        if (typeof item.label !== 'string' || typeof item.price !== 'number')
            return false;
    }

    return true;
} 

/**
 * Validates data input for editing a cart.
 * 
 * @param body - { 'discount': number }
 * @returns `true` if valid input data for a cart edit, `false` if invalid.
 */
export function validateEditCartInput(body: any): boolean {
    // Body is an Object and only contain the discount key (other attributes should be calculated).
    if (typeof body !== 'object' || Object.keys(body).some((k) => k !== 'discount'))
        return false;
    // Discount must be a valid percentage.
    else if (body.discount && !validatePercent(body.discount))
        return false;

    return true;
}

/**
 * Validates data input for editing an item.
 * 
 * @param body - { 'label': string, 'price': number }
 * @returns `true` if valid input data for an item edit, `false` if invalid.
 */
export function validateEditItemInput(body: any): boolean {
    const VALID_BODY_KEYS = ['label', 'price']; // Valid keys for body object

    // Body is Object typed and every key is valid.
    if (typeof body !== 'object' || !Object.keys(body).every((k) => VALID_BODY_KEYS.includes(k)))
        return false;
    // Label must be a string.
    else if (body.label && typeof body.label !== 'string')
        return false;
    // Price must be a number
    else if (body.price && typeof body.price !== 'number')
        return false;

    return true;
}
