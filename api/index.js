const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http"); // Import Node's HTTP module
const { Server } = require("socket.io");

// sync method
db.sequelize.sync();

// Create database if it doesn't exist
// require("./utils/db"); // need fixes.

const app = express();

global.__basedir = path.join(__dirname, "..");

// cors stuff
const whitelist = [
  "https://photo-transfer-by-qr.vercel.app/",
  // "http://localhost:3000",
  // "http://localhost:3575",
  // "http://192.168.1.10:3575",
]; //white list consumers
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize a new instance of Socket.IO by passing the HTTP server
const io = new Server(server, {
  cors: corsOptions,
});

// Listen for incoming Socket.IO connections
io.on("connection", (socket) => {
  console.log("User connected ", socket.id); // Log the socket ID of the connected user
});

// simple base route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Node+MySql APIs!!" });
});

module.exports = {
  socketObj: io,
};

require("../routes/user.routes")(app);
require("../routes/image.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, (err) => {
  if (err) {
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = server;
