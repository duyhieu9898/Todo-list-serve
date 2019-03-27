const Task = require("../Model/taskModel");
module.exports = {
    get: (req, res) => {
        Task.find({}, function(err, task) {
            if (!err) {
                res.json(task);
            } else {
                res.sendStatus(501);
                throw error;
            }
        });
    },
    detail: (req, res) => {
        res.json({ data: "restful api detail" });
    },
    update: (req, res) => {
        // console.log(req.params.TaskId);
        // console.log(req.body);
        if (req.body === null || req.body === "") {
            res.sendStatus(501);
            console.log("deos");
            return;
        }
        var options = { new: true, runValidators: true };
        Task.findByIdAndUpdate(req.params.TaskId, req.body, options, function(
            error,
            result
        ) {
            if (error) {
                res.sendStatus(501);
                throw error;
            } else {
                res.send("update successfully!");
            }
        });
    },
    store: (req, res) => {
        var query = { content: req.body.task };
        var update = { task: new Task({ content: req.body.task }) };
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };

        if (req.body.task === null || req.body.task.trim() === "") {
            res.sendStatus(501);
            console.log("deos");
            return;
        }
        //insert if not exits
        Task.findOneAndUpdate(query, update, options, function(error, result) {
            if (!error) {
                // Save the document
                result.save(function(error) {
                    if (!error) {
                        res.send("created successfully!");
                    } else {
                        res.sendStatus(501);
                        throw error;
                    }
                });
            }
        });
    },
    delete: (req, res) => {
        Task.findByIdAndDelete(req.params.TaskId, function(error, result) {
            if (error) {
                res.sendStatus(501);
                throw error;
            } else {
                res.send("deleted successfully!");
            }
        });
    }
};
