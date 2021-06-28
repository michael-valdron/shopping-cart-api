import { Router, Request, Response } from "express";
import path from "path";
import * as util from "../util";
import * as validation from "../validation";
import { CartDao, CartParams } from "../dao/cart";
import { ItemDao, ItemParams } from "../dao/item";
import { TaxDao } from "../dao/tax";
import { Cart } from "../model/cart";
import { Item } from "../model/item";

const BASE_URI = '/edit';

/**
 * Router for Update ('/api/v1/edit') APIs.
 */
const router = Router();

const invalidRequest = (req: Request, res: Response) => 
    res.status(400)
        .json(util.errorResponse(`Invalid Request: All '/api/v1/edit' routes should be POST, got ${req.method} instead.`));

router.post(path.join(BASE_URI, 'cart/:id'), async (req, res) => {
    const id = Number.parseFloat(req.params.id);
    const data = req.body;
    let status = 200;
    let resBody = {};

    if (!Number.isInteger(id)) {
        status = 400;
        resBody = util.errorResponse(`Invalid cart id number '${req.params.id}'.`);
    } else if (!validation.validateEditCartInput(data)) {
        status = 400;
        resBody = util.errorResponse("Invalid JSON input for editing a cart.");
    } else {
        const cartsDao = new CartDao();
        await cartsDao.read(id).catch((err) => {
            console.error(err);
            status = 500;
            resBody = util.DB_ERROR_RESPONSE;
        }).then(async (cart) => {
            if (status !== 500 && !(cart instanceof Cart)) {
                status = 404;
                resBody = util.errorResponse(`No cart with id '${id}' exists for editing.`);
            } else if (cart instanceof Cart) {
                let params = (data as CartParams);
                params.total = Cart.calcTotalPrice(cart.subtotal, cart.taxes, params.discount);
    
                const newCart = await cartsDao.update(cart, params).catch((err) => {
                    console.error(err);
                    status = 500;
                    resBody = util.DB_ERROR_RESPONSE;
                });
    
                if (newCart instanceof Cart)
                    resBody = newCart.toJson();
            }
        });
    }

    res.status(status).json(resBody);
});

router.post(path.join(BASE_URI, 'item/:id'), async (req, res) => {
    const id = Number.parseFloat(req.params.id);
    const data = req.body;
    let status = 200;
    let resBody = {};

    if (!Number.isInteger(id)) {
        status = 400;
        resBody = util.errorResponse(`Invalid item id number '${req.params.id}'.`);
    } else if (!validation.validateEditItemInput(data)) {
        status = 400;
        resBody = util.errorResponse("Invalid JSON input for editing an item.");
    } else {
        const itemsDao = new ItemDao();
        await itemsDao.readAll().catch((err) => {
            console.error(err);
            status = 500;
            resBody = util.DB_ERROR_RESPONSE;
        }).then(async (items) => {
            if (Array.isArray(items)) {
                const params = (data as ItemParams);
                const item = items.find((i) => i.id === id);
    
                if (!(item instanceof Item)) {
                    status = 404;
                    resBody = util.errorResponse(`No item with id '${id}' exists for editing.`);
                } else if (Object.keys(params).length !== 0) {
                    const isPriceDiff = typeof params.price === 'number' && params.price !== item.price;
                    
                    if (isPriceDiff) {
                        const cartsDao = new CartDao();
                        const taxDao = new TaxDao();
                        await cartsDao.read(item.cartId).catch((err) => {
                            console.error(err);
                            status = 500;
                            resBody = util.DB_ERROR_RESPONSE;
                        }).then(async (cart) => {
                            await taxDao.readAll().catch((err) => {
                                console.error(err);
                                status = 500;
                                resBody = util.DB_ERROR_RESPONSE;
                            }).then(async (taxes) => {
                                if (Array.isArray(items) && Array.isArray(taxes) && cart instanceof Cart) {
                                    let subtotal = params.price;
                                    let totalTax = 0;
                                    let cartParams: CartParams;

                                    items = items.filter((i) => i.cartId === item.cartId && i.id !== item.id);
                                    subtotal = items.reduce((sum, i) => sum + i.price, subtotal);
                                    totalTax = taxes.reduce((sum, tax) => sum + (tax.percent*subtotal), totalTax);
                                    cartParams = {
                                        subtotal: subtotal,
                                        taxes: totalTax,
                                        discount: cart.discount,
                                        total: Cart.calcTotalPrice(subtotal, totalTax, cart.discount)
                                    };

                                    await cartsDao.update(cart, cartParams).catch((err) => {
                                        console.error(err);
                                        status = 500;
                                        resBody = util.DB_ERROR_RESPONSE;
                                    });
                                }
                            });
                        });
                    }
                    
                    if (status === 200) {
                        const newItem = await itemsDao.update(item, params).catch((err) => {
                            console.error(err);
                            status = 500;
                            resBody = util.DB_ERROR_RESPONSE;
                        });
        
                        if (newItem instanceof Item)
                            resBody = newItem.toJson();
                    }
                }
            }
        });
    }

    res.status(status).json(resBody);
});

router.get(path.join(BASE_URI, '*'), invalidRequest);
router.put(path.join(BASE_URI, '*'), invalidRequest);
router.delete(path.join(BASE_URI, '*'), invalidRequest);

export default router;