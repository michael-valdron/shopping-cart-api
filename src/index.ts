import dotenv from 'dotenv'

import createApp from "./api"

// Load environment variables
dotenv.config();

const PORT = Number.parseInt(process.env.PORT) || 3000;

createApp().listen(PORT);