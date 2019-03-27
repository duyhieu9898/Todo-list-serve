const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const indexRouter = require("./Routers/web");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("jquery/dist/jquery");

//!BOOTSTRAP APP
app = express();
app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");
//!MIDDLEWARE
app.use("/assets", express.static(path.join(__dirname, "Public")));
app.use("/vendor", express.static(path.join(__dirname, "Vendor")));
// app.use("/", express.static(__dirname));
app.use(cors());
// app.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET,HEAD,PUT,PATCH,POST,DELETE"
//     );
//     res.setHeader("Access-Control-Allow-Headers", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Max-Age", "8600");
//     next();
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //only json

//!ROUTER
indexRouter(app);
app.use("/", function(req, res) {
    res.status(404).send({ url: req.originalUrl + " not found" });
});

//!MODEL CONNECT
const mongodb = process.env.DB_MLAB || process.env.DB_LOCAL;
mongoose.connect(
    mongodb,
    { useNewUrlParser: true }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!"));
db.once("open", function() {
    console.log("DB connected!");
});

//!SERVER
const port = process.env.PORT || 3000;
var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("sever is listening on: http://%s : %s", host, port);
});

//!MODEL CLOSE
process.on("SIGINT", function() {
    db.close(function() {
        console.log("Mongoose disconnected on app termination");
        process.exit(0);
    });
});
