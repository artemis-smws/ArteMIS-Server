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

const PORT = 1512;
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

//scheduled functions
const {
  wasteSchedPost,
} = require("./services/scheduledExecution");
const createDateId = require("./utils/createDateId");
const { CRUD } = require("./utils/crud");
const { collection, serverTimestamp, doc } = require("firebase/firestore");
const db = require("./config/firebase");

exports.wasteSchedPost = wasteSchedPost;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

exports.v1 = functions.https.onRequest(app);
