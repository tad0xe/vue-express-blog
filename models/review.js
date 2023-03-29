const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  headline: String,
  body: String,
  name:String,
  rating: Number,
 // photo: String,
  blogID: { type: Schema.Types.ObjectId, ref: "Blog" },
  time : { type : Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Review", ReviewSchema);