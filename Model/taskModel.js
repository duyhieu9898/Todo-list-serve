const mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema(
    {
        content: { type: String },
        complete: { type: Boolean, default: false }
    },
    { timestamps: { createdAt: "created_at" } }
);
module.exports = mongoose.model("task", TaskSchema);
