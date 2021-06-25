import { Router } from "express";
import path from "path";
import * as util from "../util";
import CartDao from "../dao/cart";
import ItemDao from "../dao/item";
import Cart from "../model/cart";
import Item from "../model/item";

const BASE_URI = '/add';
const router = Router();

// Creates a new cart with items
router.put(path.join(BASE_URI, '/'), async (req, res) => {
    type ItemObject = {
        label: string,
        price: number
    };
    
    type BodyObject = {
        discount?: number,
        tpercs: number[],
        items: ItemObject[]
    };

    const data: BodyObject = req.body;
    const itemData = data.items;
    const subtotal = itemData.reduce((subtot, item) => subtot + item.price, 0.0);
    const discount = (data.discount) ? data.discount : 0.0;
    const totalTax = data.tpercs
        .map((p) => (p*subtotal))
        .reduce((totalTax, tax) => totalTax + tax, 0.0);
    const cartsDao = new CartDao();
    const itemsDao = new ItemDao();
    let cart: Cart = new Cart(
        subtotal,
        discount,
        totalTax,
        (totalTax+subtotal)-(subtotal*discount)
    );
    let isErr = false;
    let items: Item[];
    
    await cartsDao.create(cart)
        .catch((err) => {
            console.error(err);
            res.status(500).json(util.DB_ERROR_RESPONSE);
        })
        .then((c) => { 
            if (c) {
                cart = c;
                items = itemData.map((item) => new Item(cart.id, item.label, item.price));
            } else {
                if (!isErr)
                    isErr = true;
            }
        });
    
    if (!isErr) {
        for (let item of items) {
            await itemsDao.create(item).catch((err) => {
                console.error(err);
                res.status(500).json(util.DB_ERROR_RESPONSE);
                isErr = !isErr;
            });
            if (isErr) {
                await cartsDao.delete(cart)
                    .catch(console.error);
                break;
            }
        }


        if (!isErr)
            res.json(util.OK_RESPONSE);
    }
    
});

export default router;