const Mongoose = require("mongoose");
//const logger = require("../scripts/logger/Projects");
const UserSchema = new Mongoose.Schema({
    full_name : String,
    password : String,
    email : String,
    profile_image : String
}, {timestamps : true, versionKey : false});

// ProjectSchema.pre("save", (next) => {   // Logging
//     // console.log("before : ", doc);
//     next();
// });
// ProjectSchema.post("save", (doc) => {   // Logging
//     logger.log({
//         level : "info",
//         message : doc
//     })

// });

module.exports = Mongoose.model("user", UserSchema);