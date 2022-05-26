import bodyParser from 'body-parser';
import express from 'express';
import client from '@sendgrid/mail';
import cors from 'cors';
import { Logger } from 'tslog'; // TODO: remove tslog dependency in production

const logger = new Logger();
logger.info('Starting server');
const app = express();  // create an instance of express
app.use(bodyParser.json()); // support json encoded bodies
app.use(cors());

client.setApiKey(process.env.SENDGRID_API_KEY || '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');

logger.info('Starting server with api key: ' + process.env.SENDGRID_API_KEY);

const port = process.env.PORT || 3000;

// POST TO http://localhost:3000/send_email with body from example "request.json"
app.post("/send_email", async (req, res) => {
    logger.info('Received email');
    logger.info(req.body);
    if (req.body === undefined) {
        res.status(400).json({
            "status_code": 400,
            "message": "Body is empty, please provide a valid body",
            "error": "Bad Request"
        });
    } else {
        const data = req.body;
        const fromEmail: string = data["from_email"];
        const fromName: string = data["from_name"];
        const listEmail: string[] = data["list_email"];
        // const listCc: string[] = data["list_cc"]; this is not used yet
        const subject: string = data["subject"];
        const contentHtml: string = data["content_html"];

        try {
            const respo = await client.send({
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
            } else {
                res.status(400).json({
                    "status_code": 400,
                    "message": "Email not sent",
                    "error": respo[0].body
                });
            }
        } catch (error) {
            res.status(500).json({
                "status_code": 500,
                "message": "Something went wrong, please try again later",
                "error": error
            });
        }
    }
});

app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
});