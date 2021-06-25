import { Express } from 'express'
import express from 'express'

import router from './router';

export default function createApp(name: string = 'shopping-chart-api'): Express {
    const app = express();

    app.set('name', name);

    app.use(express.json({ 
        inflate: true,
        limit: '10kb',
        type: 'application/json',
        verify: undefined
    }));

    // Adds router object to Express app.
    app.use(router);

    return app;
}
