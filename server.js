const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http"); // Import Node's HTTP module
const { Server } = require("socket.io"); // Import Socket.IO Server class

// Create database if it doesn't exist
// require("./utils/db"); // need fixes.

const db = require("./models");

const app = express();

global.__basedir = __dirname;

// cors stuff
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://172.20.10.9:5173",
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

// sync method
db.sequelize.sync();

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

require("./routes/user.routes")(app);
require("./routes/image.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, (err) => {
  if (err) {
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}.`);
});
