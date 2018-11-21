var mongoose = require("mongoose");
var plm = require("passport-local-mongoose");
mongoose.set('useCreateIndex', true);

var userSch = new mongoose.Schema({
    
    uname : String,
    pass : String
});

userSch.plugin(plm);

module.exports = mongoose.model("User",userSch);


