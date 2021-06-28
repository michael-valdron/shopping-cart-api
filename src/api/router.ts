import { Router, Request, Response } from "express"
import path from "path"

import view from "./routes/view"
import add from "./routes/add"
import edit from "./routes/edit"
import checkout from "./routes/checkout"
import * as util from "./util"

const BASE_URI = '/api/v1';

/**
 * Main '/api' router.
 */
const router = Router();

/**
 * Handler for non existing APIs (status 404).
 * 
 * @param req - `Request`
 * @param res - `Response`
 */
function notFound(req: Request, res: Response) {
    res.status(404).json(util.errorResponse("api not found"));
}

router.get(path.join(BASE_URI, 'ping'), (req, res) => {
    res.json({'response': 'Hello World!'});
});

// Add Create routes
router.use(BASE_URI, add);

// Add Read routes
router.use(BASE_URI, view);

// Add Update routes
router.use(BASE_URI, edit);

// Add Delete routes
router.use(BASE_URI, checkout);

// Add 404 routes
router.get('*', notFound);
router.post('*', notFound);
router.put('*', notFound);
router.delete('*', notFound);

export default router;
