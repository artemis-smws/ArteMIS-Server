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
const statusRouter = require('./routes/statusRouter')
const buildingRouter = require('./routes/buildingRouter')


const PORT =  1234;

const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({methods : ['GET' , 'POST', 'PUT', 'DELETE', 'PATCH']}));
app.use(helmet());
app.use(bodyParser.json())

// routes
app.use('/status', statusRouter)
app.use('/bin', binRouter)
app.use('/waste', wasteRouter)
app.use('/trashbin', trashbinRouter)
app.use('/auth', authRouter)
app.use('/reports', reportsRouter)
app.use('/building', buildingRouter)

// const { setDoc, doc } = require('firebase/firestore');
// const db = require('./firebase');
// const { CRUD } = require('./module/crud');

// app.post('/testing', async (req, res) => {
//   const today = new Date();
//   const day = today.getDate();
//   const month = today.getMonth() + 1;
//   const year = today.getFullYear();
//   const docID = `${month}-${day}-${year % 100}`;

//     const data = {  
//       buildings_count: 0,
//       weight: 0,
//       average: 0,
//     }
//     const docRef = doc(db, 'status', docID)
//     const cb_data = await CRUD.createSpecific(docRef, data)
//     res.send({message : cb_data})
// })


//scheduled functions
const {wasteSchedPost, yearlyWasteSchedPost, statusSchedPostDaily, monthlyStatusSchedPost, weeklyWasteSchedPost} = require('./module/scheduledExecution');


exports.wasteSchedPost = wasteSchedPost;
exports.yearly_wasteSchedPost = yearlyWasteSchedPost;
exports.monthlyStatusSchedPost = monthlyStatusSchedPost
exports.statusSchedPostDaily = statusSchedPostDaily;
exports.weeklyStatusSchedPost = weeklyWasteSchedPost;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

exports.server = functions.https.onRequest(app);
