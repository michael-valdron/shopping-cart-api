import * as validation from '../../api/validation'

test('testValidateAddCartInput', () => {
    const validAddCartInputOne = {
        items: [
            {
                label: 'Milk',
                price: 2.99
            },
            {
                label: 'Eggs',
                price: 4.99
            }
        ]
    };
    const validAddCartInputTwo = {
        discount: 0.15, // 15%
        items: [
            {
                label: 'Cereal',
                price: 3.99
            }
        ]
    };
    const invalidAddCartInputOne = {
        items: [
            {
                label: 'Milk'
            },
            {
                price: 4.99
            }
        ]
    };
    const invalidAddCartInputTwo = {
        discount: -0.15, // -15%
        foo: "bar"
    };
    
    expect(validation.validateAddCartInput(validAddCartInputOne)).toBeTruthy();
    expect(validation.validateAddCartInput(validAddCartInputTwo)).toBeTruthy();
    expect(validation.validateAddCartInput(invalidAddCartInputOne)).toBeFalsy();
    expect(validation.validateAddCartInput(invalidAddCartInputTwo)).toBeFalsy();
});

test('testValidateEditCartInput', () => {
    const validEditCartInput = {
        discount: 0.15 // 15%
    };
    const invalidEditCartInputOne = {
        discount: 2
    };
    const invalidEditCartInputTwo = {
        discount: -0.15,
        foo: "bar"
    };
    
    expect(validation.validateEditCartInput(validEditCartInput)).toBeTruthy();
    expect(validation.validateEditCartInput(invalidEditCartInputOne)).toBeFalsy();
    expect(validation.validateEditCartInput(invalidEditCartInputTwo)).toBeFalsy();
});

test('testValidateEditItemInput', () => {
    const validEditItemInputOne = {
        label: "Bread"
    };
    const validEditItemInputTwo = {
        price: 7.99
    };
    const validEditItemInputThree = {
        label: "Bread",
        price: 7.99
    };
    const invalidEditItemInputOne = {
        label: "Bread",
        price: "foo"
    };
    const invalidEditItemInputTwo = {
        price: 7.99,
        foo: "bar"
    };
    
    expect(validation.validateEditItemInput(validEditItemInputOne)).toBeTruthy();
    expect(validation.validateEditItemInput(validEditItemInputTwo)).toBeTruthy();
    expect(validation.validateEditItemInput(validEditItemInputThree)).toBeTruthy();
    expect(validation.validateEditItemInput(invalidEditItemInputOne)).toBeFalsy();
    expect(validation.validateEditItemInput(invalidEditItemInputTwo)).toBeFalsy();
});
