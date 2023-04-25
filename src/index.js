const express = require('express')
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require('body-parser')
const PORT = 5656;
const functions = require('firebase-functions');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(bodyParser.json())

app.get("/", cors(), (req, res) => {
  res.send("This is the landing page of the server");
});

const binRouter = require('./routes/binRouter')
app.use('/bin', binRouter)

const wasteRouter = require('./routes/wasteRouter')
app.use('/waste', wasteRouter)

app.listen(PORT, () => {
  console.log(`This is listening the http://localhost:${PORT}`);
});

exports.server = functions.https.onRequest(app);
