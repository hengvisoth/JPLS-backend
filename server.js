require("dotenv").config();
process.env["NTBA_FIX_319"] = 1; // telegram: cancellation of promises
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const swaggerUi = require('swagger-ui-express');

exports.io = require("socket.io")(server);

const plate_logsRouter = require("./routes/plate_logs");
const currently_insRouter = require("./routes/currently_in");
const commitLogsRouter = require("./routes/commitlogs");
const known_platesRouter = require("./routes/known_plates");
const bad_platesRouter = require("./routes/bad_plates");
const userRoutes = require("./routes/user");
const docs = require("./utils/docs")

const initUser = require("./controllers/initUser");

const apiPrefix = "/api"

const startServer = async () => {
  // connect DB
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  const db = mongoose.connection;
  db.on("error", (error) => console.log(error));
  db.once("open", () => console.log("Connected to Database"));

  await initUser();
  app.use(cors());
  app.use(express.json());
  app.use(apiPrefix+"/user", userRoutes);
  app.use(apiPrefix+"/bad_plates", bad_platesRouter);
  app.use(apiPrefix+"/known_plates", known_platesRouter);
  app.use(apiPrefix+"/commitlogs", commitLogsRouter);
  app.use(apiPrefix+"/currently_in", currently_insRouter);
  app.use(apiPrefix+"/plate_logs", plate_logsRouter);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(docs.specs));
  app.use(express.static('../realtime_images'));

  app.use(express.static(__dirname + "/dist/"));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/dist/index.html"));

  server.listen(3000, () => console.log("Server Started"));
};
startServer();
