"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tslog_1 = require("tslog"); // TODO: remove tslog dependency in production
const logger = new tslog_1.Logger();
logger.info('Starting server');
const app = (0, express_1.default)(); // create an instance of express
const port = process.env.PORT || 3000;
// create a post request handler
app.post('/client', (req, res) => {
    res.send('Hello World!');
    logger.warn('Hello World!');
});
app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
});
//# sourceMappingURL=server.js.map