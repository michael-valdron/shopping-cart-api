import { Router, Request, Response } from "express"
import path from "path"

import view from "./routes/view"
import add from "./routes/add"

const BASE_URI = '/api';
const router = Router();

function notFound(req: Request, res: Response) {
    res.status(404).json({'error': 'api not found'});
}

router.get(path.join(BASE_URI, 'ping'), (req, res) => {
    res.json({'response': 'Hello World!'});
});

// Add Create routes
router.use(BASE_URI, add);

// Add Read routes
router.use(BASE_URI, view);

// Add 404 responses
router.get('*', notFound);
router.post('*', notFound);
router.put('*', notFound);
router.delete('*', notFound);

export default router;
