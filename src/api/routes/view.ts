import { Router } from "express";
import path from "path";
import * as util from "../util"
import CartDao from "../dao/cart";
import ItemDao from "../dao/item";

const BASE_URI = '/view';
const router = Router();

// View cart with items by id
router.get(path.join(BASE_URI, 'cart/:id'), async (req, res) => {
    const id = Number.parseInt(req.params.id);
    const cartsDao = new CartDao();
    const itemsDao = new ItemDao();

    const cart = await cartsDao.read(id)
        .catch((err) => {
            console.error(err);
            res.status(500).json(util.DB_ERROR_RESPONSE);
        });
    
    if (cart) {
        let items = await itemsDao.readAll()
            .catch((err) => {
                console.error(err);
                res.status(500).json(util.DB_ERROR_RESPONSE);
            });
        if (items) {
            items = items.filter((item) => item.cartId === cart.id);
            res.json({
                ...cart.toJson(), 
                items: items.map((item) => item.toJson())
            });
        }
    }
});

export default router;