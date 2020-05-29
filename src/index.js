import bodyParser from 'body-parser';
import express from 'express'
import serverless from 'serverless-http'
import {userRouter} from "./routes/users";


const app = express()

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello World!')
})
app.use(userRouter)

module.exports.handler = serverless(app);