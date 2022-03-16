import express from 'express';
import { Logger } from 'tslog'; // TODO: remove tslog dependency in production

const logger = new Logger();
logger.info('Starting server');
const app = express();  // create an instance of express


const port = process.env.PORT || 3000;

// create a post request handler
app.post('/client', (req, res) => {
    res.send('Hello World!');
    logger.warn('Hello World!');
});

app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
});