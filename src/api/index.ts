import { Express } from 'express'
import express from 'express'

import router from './router';

/**
 * Factory function for creating instances of the {@link Express} application. 
 * 
 * @param name - name of {@link Express} application instance.
 * @returns an instance of the {@link Express} application object.
 */
export default async function createApp(name: string = 'shopping-chart-api'): Promise<Express> {
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
