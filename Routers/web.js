var express = require("express");
var router = express.Router();

module.exports = function(app) {
    app.route("/").get(function(err, res, body) {
        res.render("index", { title: "NodeJs vs VueJs" });
    });
    app.route("/api").get(function(err, res, body) {
        res.json({ server: "nodejs" });
    });
    let taskController = require("../Controller/taskController.js");
    // todoList Routes restful api
    app.route("/task")
        .get(taskController.get)
        .post(taskController.store);

    app.route("/task/:TaskId")
        .get(taskController.detail)
        .put(taskController.update)
        .delete(taskController.delete);
};
