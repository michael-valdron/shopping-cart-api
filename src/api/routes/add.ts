import { Router, Request, Response } from "express";
import path from "path";
import * as util from "../util";
import * as validation from "../validation";
import { CartDao } from "../dao/cart";
import { ItemDao } from "../dao/item";
import { TaxDao } from "../dao/tax";
import { Cart } from "../model/cart";
import { Item } from "../model/item";

const BASE_URI = '/add';

/**
 * Router for Create ('/api/v1/add') APIs.
 */
const router = Router();

const invalidRequest = (req: Request, res: Response) => 
    res.status(400)
        .json(util.errorResponse(`Invalid Request: All '/api/v1/add' routes should be PUT, got ${req.method} instead.`));

/**
 * Creates a new cart.
 */
router.put(path.join(BASE_URI, '/'), async (req, res) => {
    const data = req.body;
    let status = 200;
    let resBody = {};

    if (validation.validateAddCartInput(data)) {
        const itemData = data.items as any[];
        const taxesDao = new TaxDao();
        const taxes = await taxesDao.readAll().catch((err) => {
            console.error(err);
            status = 500;
            resBody = util.DB_ERROR_RESPONSE;
        });

        if (Array.isArray(taxes)) {
            const subtotal = itemData.reduce<number>((subtot, item) => subtot + (item.price as number), 0.0);
            const discount = (data.discount) ? (data.discount as number) : 0.0;
            const totalTax = taxes.map((t) => (t.percent*subtotal))
                .reduce((totalTax, tax) => totalTax + tax, 0.0);
            const cartsDao = new CartDao();
            const itemsDao = new ItemDao();
            const cart = new Cart(subtotal, discount, totalTax);
            
            const cartWithId = await cartsDao.create(cart)
                .catch((err) => {
                    console.error(err);
                    status = 500;
                    resBody = util.DB_ERROR_RESPONSE;
                });
            
            if (cartWithId instanceof Cart) {
                const items = itemData
                    .map((item) => new Item(cartWithId.id, item.label as string, item.price as number));
                const itemsWithIds: Item[] = [];

                for (const item of items) {
                    const r = await itemsDao.create(item).catch((err) => {
                        console.error(err);
                        status = 500;
                        resBody = util.DB_ERROR_RESPONSE;
                    });

                    if (!(r instanceof Item)) {
                        await cartsDao.delete(cartWithId)
                            .catch(console.error);
                        break;
                    } else {
                        itemsWithIds.push(r);
                    }
                }
                
                if (status === 200) {
                    resBody = {
                        ...cartWithId.toJson(),
                        items: itemsWithIds.map((item) => item.toJson())
                    };
                }
            }
        }
    } else {
        status = 400;
        resBody = util.errorResponse("Invalid JSON input for creating a cart.");
    }

    res.status(status).json(resBody);
});

router.get(path.join(BASE_URI, '/'), invalidRequest);
router.post(path.join(BASE_URI, '/'), invalidRequest);
router.delete(path.join(BASE_URI, '/'), invalidRequest);
router.get(path.join(BASE_URI, '*'), invalidRequest);
router.post(path.join(BASE_URI, '*'), invalidRequest);
router.delete(path.join(BASE_URI, '*'), invalidRequest);

export default router;