import request from 'supertest';
import { Express } from 'express';
import dotenv from 'dotenv';

import createApp from "../../api";
import * as util from "../../api/util";

let server: Express

beforeAll(async () => {
    // Load environment variables
    dotenv.config();
    server = await createApp();
});

describe('PUT /api/v1/add', () => {
    it('should return status code 400 and a JSON error response for no data passed', (done) => {
        request(server).put('/api/v1/add')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid JSON input for creating a cart."));
                done();
            });
    });
    
    it('should return status code 400 and a JSON error response for invalid input data', (done) => {
        const input = {
            items: [
                {
                    label: 'Milk'
                },
                {
                    price: 4.99
                }
            ]
        };

        request(server).put('/api/v1/add')
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid JSON input for creating a cart."));
                done();
            });
    });

    it('should return status code 200 and a JSON response of added cart and items', (done) => {
        const input = {
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
        const expectedCartKeys = ['id', 'subtotal', 'discount', 'taxes', 'total', 'items'];

        request(server).put('/api/v1/add')
            .send(input)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(Object.keys(res.body).sort()).toEqual(expectedCartKeys.sort());
                done();
            });
    });
});

describe('GET /api/v1/view/cart/id', () => {
    it('should return status code 200 and a JSON response of cart ids', (done) => {
        request(server).get('/api/v1/view/cart/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(Array.isArray(res.body)).toBeTruthy();
                done();
            });
    });
});

describe('GET /api/v1/view/item/id', () => {
    it('should return status code 200 and a JSON response of item ids', (done) => {
        request(server).get('/api/v1/view/item/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(Array.isArray(res.body)).toBeTruthy();
                done();
            });
    });
});

describe('GET /api/v1/view/cart/:id', () => {
    it('should return status code 400 and a JSON error response for invalid id', (done) => {
        request(server).get('/api/v1/view/cart/a')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid cart id number 'a'."));
                done();
            });
    });

    it('should return status code 400 and a JSON error response for invalid id', (done) => {
        request(server).get('/api/v1/view/cart/1.2')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid cart id number '1.2'."));
                done();
            });
    });

    it('should return status code 200 and a JSON response of cart object with items', (done) => {
        const expectedCartKeys = ['id', 'subtotal', 'discount', 'taxes', 'total', 'items'];

        request(server).get('/api/v1/view/cart/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                const cartIds = (res.body as number[]);
                request(server).get(`/api/v1/view/cart/${cartIds[cartIds.length-1]}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        expect(Object.keys(res.body).sort()).toEqual(expectedCartKeys.sort());
                        done();
                    });
                done();
            });
    });
});

describe('POST /api/v1/edit/cart/:id', () => { 
    const validInput = {
        discount: 0.20
    };
    const invalidInput = {
        foo: "bar"
    };

    it('should return status code 400 and a JSON error response for invalid id', (done) => {
        request(server).post('/api/v1/edit/cart/a')
            .send(validInput)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid cart id number 'a'."));
                done();
            });
    });

    it('should return status code 400 and a JSON error response for invalid id', (done) => {
        request(server).post('/api/v1/edit/cart/1.2')
            .send(validInput)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid cart id number '1.2'."));
                done();
            });
    });

    it('should return status code 400 and a JSON error response for invalid input data', (done) => {
        request(server).get('/api/v1/view/cart/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                const cartIds = (res.body as number[]);
                request(server).post(`/api/v1/edit/cart/${cartIds[cartIds.length-1]}`)
                    .send(invalidInput)
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        expect(res.body).toMatchObject(util.errorResponse("Invalid JSON input for editing a cart."));
                        done();
                    });
                done();
            });
    });

    it('should return status code 404 and a JSON error response for no cart found for given id', (done) => {
        request(server).get('/api/v1/view/cart/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                const cartIds = (res.body as number[]);
                request(server).post(`/api/v1/edit/cart/${cartIds[cartIds.length-1]+1}`)
                    .send(validInput)
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        expect(res.body).toMatchObject(util.errorResponse(`No cart with id '${cartIds[cartIds.length-1]+1}' exists for editing.`));
                        done();
                    });
                done();
            });
    });

    it('should return status code 200 and a JSON response of edited cart', (done) => {
        const expectedCartKeys = ['id', 'subtotal', 'discount', 'taxes', 'total'];

        request(server).get('/api/v1/view/cart/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                const cartIds = (res.body as number[]);
                request(server).post(`/api/v1/edit/cart/${cartIds[cartIds.length-1]}`)
                    .send(validInput)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        expect(Object.keys(res.body).sort()).toEqual(expectedCartKeys.sort());
                        expect(res.body.discount).toEqual(validInput.discount);
                        done();
                    });
                done();
            });
    });
});

describe('POST /api/v1/edit/item/:id', () => { 
    const validInput = {
        price: 5.99
    };
    const invalidInput = {
        foo: "bar"
    };

    it('should return status code 400 and a JSON error response for invalid id', (done) => {
        request(server).post('/api/v1/edit/item/a')
            .send(validInput)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid item id number 'a'."));
                done();
            });
    });

    it('should return status code 400 and a JSON error response for invalid id', (done) => {
        request(server).post('/api/v1/edit/item/1.2')
            .send(validInput)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid item id number '1.2'."));
                done();
            });
    });

    it('should return status code 400 and a JSON error response for invalid input data', (done) => {
        request(server).get('/api/v1/view/item/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                const itemIds = (res.body as number[]);
                request(server).post(`/api/v1/edit/item/${itemIds[itemIds.length-1]}`)
                    .send(invalidInput)
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        expect(res.body).toMatchObject(util.errorResponse("Invalid JSON input for editing an item."));
                        done();
                    });
                done();
            });
    });

    it('should return status code 404 and a JSON error response for no item found for given id', (done) => {
        request(server).get('/api/v1/view/item/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                const itemIds = (res.body as number[]);
                request(server).post(`/api/v1/edit/item/${itemIds[itemIds.length-1]+1}`)
                    .send(validInput)
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        expect(res.body).toMatchObject(util.errorResponse(`No item with id '${itemIds[itemIds.length-1]+1}' exists for editing.`));
                        done();
                    });
                done();
            });
    });

    it('should return status code 200 and a JSON response of edited item', (done) => {
        const expectedItemKeys = ['id', 'cartId', 'label', 'price'];

        request(server).get('/api/v1/view/item/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                const itemIds = (res.body as number[]);
                request(server).post(`/api/v1/edit/item/${itemIds[itemIds.length-1]}`)
                    .send(validInput)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        expect(Object.keys(res.body).sort()).toEqual(expectedItemKeys.sort());
                        expect(res.body.price).toEqual(validInput.price);
                        done();
                    });
            });
    });
});

describe('DELETE /api/v1/checkout/cart/:id', () => {
    it('should return status code 400 and a JSON error response for invalid id', (done) => {
        request(server).delete('/api/v1/checkout/cart/a')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid cart id number 'a'."));
                done();
            });
    });

    it('should return status code 400 and a JSON error response for invalid id', (done) => {
        request(server).delete('/api/v1/checkout/cart/1.2')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                expect(res.body).toMatchObject(util.errorResponse("Invalid cart id number '1.2'."));
                done();
            });
    });

    it('should return status code 404 and a JSON error response for no cart found for given id', (done) => {
        request(server).get('/api/v1/view/cart/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                const cartIds = (res.body as number[]);
                request(server).delete(`/api/v1/checkout/cart/${cartIds[cartIds.length-1]+1}`)
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        expect(res.body).toMatchObject(util.errorResponse(`No cart with id '${cartIds[cartIds.length-1]+1}' exists to delete.`));
                        done();
                    });
            });
    });

    it('should return status code 200 and a JSON response of deleted cart object with items', (done) => {
        const expectedCartKeys = ['id', 'subtotal', 'discount', 'taxes', 'total', 'items'];

        request(server).get('/api/v1/view/cart/id')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                const cartIds = (res.body as number[]);
                request(server).delete(`/api/v1/checkout/cart/${cartIds[cartIds.length-1]}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        expect(Object.keys(res.body).sort()).toEqual(expectedCartKeys.sort());
                        done();
                    });
            });
    });
});