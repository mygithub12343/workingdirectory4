var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User" //collection we are referring to
        },
        username: String
    }
});
 
module.exports = mongoose.model("Comment", commentSchema);