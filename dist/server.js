"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const tslog_1 = require("tslog"); // TODO: remove tslog dependency in production
dotenv.config();
const logger = new tslog_1.Logger();
logger.info('Starting server');
const app = (0, express_1.default)(); // create an instance of express
app.use(body_parser_1.default.json()); // support json encoded bodies
// app.use(cors());
/* const corsOptions = {
    origin: "*",

  } */
app.options('*', (0, cors_1.default)());
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
logger.info('Starting server with api key: ' + process.env.SENDGRID_API_KEY);
const port = process.env.PORT || 3000;
// POST TO http://localhost:3000/send_email with body from example "request.json"
app.post("/send_email", (0, cors_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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