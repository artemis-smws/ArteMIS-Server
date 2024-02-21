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

const PORT = 3000;
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

app.post("/iot", async (req , res) => {
  try {
    const iotDoc = doc(db, "iot", "Vj3orFvyls0uj1dKby1E")
    const iotRef = collection(db, "iot")
    const status = await CRUD.update(iotDoc, {
      ...req.body,
      createdAt : serverTimestamp()
    })
    res.send(status)
  } catch (e) {
    res.send({error : e.message})
  }
})

//scheduled functions
const {
  wasteSchedPost
} = require("./services/scheduledAddWasteData");
const { AddBinData } = require("./services/scheduledAddBinData");

exports.wasteSchedPost = wasteSchedPost;
exports.binSchedPost = AddBinData

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

exports.v1 = functions.https.onRequest(app);
