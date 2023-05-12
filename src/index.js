'use strict';
const express = require('express')
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require('body-parser')
const functions = require('firebase-functions');
require('./config/config')
const binRouter = require('./routes/binRouter')
const wasteRouter = require('./routes/wasteRouter')
const trashbinRouter = require('./routes/trashbinRouter')
const authRouter = require('./routes/authRouter');
const reportsRouter = require('./routes/reportsRouter');
const total_yearlyRouter = require('./routes/total_yearlyRouter')

const PORT =  2345;

const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({methods : ['GET' , 'POST', 'PUT', 'DELETE', 'PATCH']}));
app.use(helmet());
app.use(bodyParser.json())

// routes
app.use('/total_yearly', total_yearlyRouter)
app.use('/bin', binRouter)
app.use('/waste', wasteRouter)
app.use('/trashbin', trashbinRouter)
app.use('/auth', authRouter)
app.use('/reports', reportsRouter)

//post empty field in waste endpoint 
exports.wasteSchedPost =  require('./models/scheduledExecution')
exports.yearlyWasteSchedPost = require('./models/scheduledExecution')

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

exports.server = functions.https.onRequest(app);
