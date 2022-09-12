// Basic Dependencies
const express = require("express");

const app = express();
const http = require("http").Server(app);

// Database related dependencies
const mongoose = require("mongoose");
mongoose.Promise = Promise;

// Custom configurations & Routes
const configs = require("./configs");
const routes = require("./routes");

// Application Configurations
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Using Routes
app.use('/', routes());

//Connecting to MongoDB
mongoose.connect(
  configs.mongoDb.url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if(err) {
      console.log("Error connecting to MongoDB Server");
    }
  }
);

// Starting server 
const server = http.listen(configs.appPort, () => {});