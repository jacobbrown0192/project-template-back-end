import bodyParser from 'body-parser';
import express, {Request, Response} from 'express'
import serverless from 'serverless-http'
import routes from "./routes";
import {APIGatewayProxyHandler} from "aws-lambda";


const app = express()

app.use(bodyParser.json({ strict: false }));

app.get('/message', (_req: Request, res: Response) => {
  // console.log('here?')
  res.send({ message: 'This is message route' });
});

app.get('/', function (_req, res) {
  res.send('Hello World!')
})

app.use(routes())

app.use((_req: Request, res: Response) => {
  res.send({ message: 'No route found' });
});

export const handler: APIGatewayProxyHandler  = serverless(app);
