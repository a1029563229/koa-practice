const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模板
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});

module.exports = Post = mongoose.model("posts", PostSchema);