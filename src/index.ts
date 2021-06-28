import dotenv from 'dotenv'
import throng from 'throng'

import createApp from "./api"

// Load environment variables
dotenv.config();

const PORT = Number.parseInt(process.env.PORT) || 3000;
const WORKERS = Number.parseInt(process.env.WEB_CONCURRENCY) || 1;

throng({
    start: () => createApp().then((server) => {
        server.listen(PORT);
        console.log("Listening on", PORT);
    }).catch((err) => {
        console.error(err);
    }),
    workers: WORKERS,
    lifetime: Infinity
});
