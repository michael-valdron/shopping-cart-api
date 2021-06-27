import { Router, Request, Response } from "express";
import path from "path";
import * as util from "../util"
import CartDao from "../dao/cart";
import Cart from "../model/cart";
import ItemDao from "../dao/item";

const BASE_URI = '/checkout';

/**
 * Router for Delete ('/api/checkout') APIs.
 */
const router = Router();

const invalidRequest = (req: Request, res: Response) => 
    res.status(400)
        .json(util.errorResponse(`Invalid Request: All '/api/checkout' routes should be DELETE, got ${req.method} instead.`));

router.delete(path.join(BASE_URI, '/cart/:id'), async (req, res) => {
    const id = Number.parseFloat(req.params.id);
    let status = 200;
    let resBody = {};

    if (!Number.isInteger(id)) {
        status = 400;
        resBody = util.errorResponse(`Invalid cart id number '${req.params.id}'.`);
    } else {
        const cartsDao = new CartDao();
        await cartsDao.read(id).catch((err) => {
            console.error(err);
            status = 500;
            resBody = util.DB_ERROR_RESPONSE;
        }).then(async (cart) => {
            if (status !== 500 && !(cart instanceof Cart)) {
                status = 404;
                resBody = util.errorResponse(`No cart with id '${id}' exists to delete.`);
            } else if (cart instanceof Cart) {
                const itemsDao = new ItemDao();
                await itemsDao.readAll().catch((err) => {
                    console.error(err);
                    status = 500;
                    resBody = util.DB_ERROR_RESPONSE;
                }).then(async (items) => {
                    if (Array.isArray(items)) {
                        await cartsDao.delete(cart).catch((err) => {
                            console.error(err);
                            status = 500;
                            resBody = util.DB_ERROR_RESPONSE;
                        }).then((delCart) => {
                            if (delCart instanceof Cart) {
                                const delItems = items.filter((i) => i.cartId === delCart.id)
                                    .map((i) => i.toJson());
                                resBody = {
                                    ...delCart.toJson(),
                                    items: delItems
                                };
                            }
                        });
                    }
                });
                
            }
        });
    }

    res.status(status).json(resBody);
});

router.get(path.join(BASE_URI, '*'), invalidRequest);
router.put(path.join(BASE_URI, '*'), invalidRequest);
router.post(path.join(BASE_URI, '*'), invalidRequest);

export default router;