"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const tslog_1 = require("tslog"); // TODO: remove tslog dependency in production
const logger = new tslog_1.Logger();
logger.info('Starting server');
const app = (0, express_1.default)(); // create an instance of express
app.use(body_parser_1.default.json()); // support json encoded bodies
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const port = process.env.PORT || 3000;
// POST TO http://localhost:3000/send_email with body from example "request.json"
app.post("/send_email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('Received email');
    logger.info(req.body);
    if (req.body === undefined) {
        res.status(400).json({
            "status_code": 400,
            "message": "Body is empty, please provide a valid body",
            "error": "Bad Request"
        });
    }
    else {
        const data = req.body;
        const fromEmail = data["from_email"];
        const fromName = data["from_name"];
        const listEmail = data["list_email"];
        // const listCc: string[] = data["list_cc"]; this is not used yet
        const subject = data["subject"];
        const contentHtml = data["content_html"];
        try {
            const respo = yield mail_1.default.send({
                to: listEmail,
                from: {
                    email: fromEmail,
                    name: fromName
                },
                // cc: listCc,
                subject: subject,
                html: contentHtml,
            });
            logger.info(respo[0].statusCode);
            if (respo[0].statusCode === 202 || respo[0].statusCode === 200) {
                res.status(200).json({
                    "status_code": 200,
                    "message": "Email sent",
                    "error": null
                });
            }
            else {
                res.status(400).json({
                    "status_code": 400,
                    "message": "Email not sent",
                    "error": respo[0].body
                });
            }
        }
        catch (error) {
            res.status(500).json({
                "status_code": 500,
                "message": "Something went wrong, please try again later",
                "error": error
            });
        }
    }
}));
app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
});
//# sourceMappingURL=server.js.map