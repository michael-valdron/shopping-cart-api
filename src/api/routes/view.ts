import { Router, Request, Response } from "express";
import path from "path";
import * as util from "../util"
import CartDao from "../dao/cart";
import ItemDao from "../dao/item";
import Cart from "../model/cart";

const BASE_URI = '/view';

/**
 * Router for Create ('/api/v1/view') APIs.
 */
const router = Router();

const invalidRequest = (req: Request, res: Response) => 
    res.status(400)
        .json(util.errorResponse(`Invalid Request: All '/api/v1/view' routes should be GET, got ${req.method} instead.`));

/**
 * '/api/view/cart/id'.
 */
 router.get(path.join(BASE_URI, 'cart/id'), async (req, res) => {
    const cartsDao = new CartDao();
    let status = 200;
    let resBody = {};

    await cartsDao.readAll().catch((err) => {
        console.error(err);
        status = 500;
        resBody = util.DB_ERROR_RESPONSE;
    }).then((carts) => {
        if (Array.isArray(carts)) {
            resBody = carts.map((cart) => cart.id);
        }
    });

    res.status(status).json(resBody);
});

/**
 * View cart with items by id.
 */
router.get(path.join(BASE_URI, 'cart/:id'), async (req, res) => {
    const id = Number.parseFloat(req.params.id);
    let status = 200;
    let resBody = {};

    if (Number.isInteger(id)) {
        const cartsDao = new CartDao();
        const itemsDao = new ItemDao();

        const cart = await cartsDao.read(id)
            .catch((err) => {
                console.error(err);
                status = 500;
                resBody = util.DB_ERROR_RESPONSE;
            });
        
        if (cart instanceof Cart) {
            let items = await itemsDao.readAll()
                .catch((err) => {
                    console.error(err);
                    status = 500;
                    resBody = util.DB_ERROR_RESPONSE;
                });

            if (Array.isArray(items)) {
                items = items.filter((item) => item.cartId === cart.id);
                resBody = {
                    ...cart.toJson(),
                    items: items.map((item) => item.toJson())
                };
            }
        }
    } else {
        status = 400;
        resBody = util.errorResponse(`Invalid cart id number '${req.params.id}'.`);
    }

    res.status(status).json(resBody);
});

/**
 * '/api/view/item/id'.
 */
 router.get(path.join(BASE_URI, 'item/id'), async (req, res) => {
    const itemsDao = new ItemDao();
    let status = 200;
    let resBody = {};

    await itemsDao.readAll().catch((err) => {
        console.error(err);
        status = 500;
        resBody = util.DB_ERROR_RESPONSE;
    }).then((items) => {
        if (Array.isArray(items)) {
            resBody = items.map((item) => item.id);
        }
    });

    res.status(status).json(resBody);
});

router.post(path.join(BASE_URI, '*'), invalidRequest);
router.put(path.join(BASE_URI, '*'), invalidRequest);
router.delete(path.join(BASE_URI, '*'), invalidRequest);

export default router;