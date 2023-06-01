"use strict";
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const functions = require("firebase-functions");
require("./config/config");
const binRouter = require("./routes/binRouter");
const wasteRouter = require("./routes/wasteRouter");
const trashbinRouter = require("./routes/trashbinRouter");
const authRouter = require("./routes/authRouter");
const reportsRouter = require("./routes/reportsRouter");
const statusRouter = require("./routes/statusRouter");
const buildingRouter = require("./routes/buildingRouter");

const PORT = 5131;

const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] }));
app.use(helmet());
app.use(bodyParser.json());

// routes
app.use("/status", statusRouter);
app.use("/bin", binRouter);
app.use("/waste", wasteRouter);
app.use("/trashbin", trashbinRouter); 
app.use("/auth", authRouter);
app.use("/reports", reportsRouter);
app.use("/building", buildingRouter);

// const { setDoc, doc, collection, query, orderBy, limit, serverTimestamp, getDoc, where, and } = require('firebase/firestore');
// const db = require('./firebase');
// const { CRUD } = require('./module/crud');
// const buildingRef = collection(db, 'building');
// const wasteRef = collection(db, 'waste');

// app.get("/testing", async (req, res) => {
//   try {
//       const currentMonth = new Date()

//     const q = query(wasteRef, and(where("createdAt", ">=", new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)), where('createdAt', '<=', new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))))
//     const data = await CRUD.readAll(q)
//     const compiledDate = []
//     data.forEach(doc =>{
//       const miliseconds  = doc.createdAt.seconds * 1000 + Math.floor(doc.createdAt.nanoseconds / 1e6)
//       const date = new Date(miliseconds)
//       const day = date.getDate()
//       const month = date.getMonth()
//       compiledDate.push({day : day, month : month})
//     })
//     res.send(data)
//   } catch (error) {
//     res.send({error : error.message})
//   }
  
// });

//scheduled functions
const {
  wasteSchedPost,
  yearlyWasteSchedPost,
  statusSchedPostDaily,
  monthlyStatusSchedPost,
  weeklyWasteSchedPost,
} = require("./module/scheduledExecution");

exports.wasteSchedPost = wasteSchedPost;
exports.yearly_wasteSchedPost = yearlyWasteSchedPost;
exports.monthlyStatusSchedPost = monthlyStatusSchedPost;
exports.statusSchedPostDaily = statusSchedPostDaily;
exports.weeklyStatusSchedPost = weeklyWasteSchedPost;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

exports.server = functions.https.onRequest(app);
