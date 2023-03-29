const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//const mongooseAlgolia = require("mongoose-algolia");
const DealSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    owner: { type: Schema.Types.ObjectId, ref: "Owner" },
    title: String,
    description: String,
    photo: String,
    price: Number,
    stockQuantity: Number,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
   
 //   time: { type: Date, default: Date.now },
 createdAt: { type: Date, expires: '5m', default: Date.now }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  },
  {
    timestamps: true
  }
);

const Deal = mongoose.model("Deal", DealSchema);
module.exports = Deal;
