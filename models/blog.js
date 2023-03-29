const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//const mongooseAlgolia = require("mongoose-algolia");
const BlogSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    owner: { type: Schema.Types.ObjectId, ref: "Owner" },
    title: String,
    description: String,
    snippet: String,

    photos: { type: Array },
    photo: [Object],
    time: { type: Date, default: Date.now },

    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

/*
BlogSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SECRET,
  indexName: process.env.ALGOLIA_INDEX,
  selector: "title _id photo description price rating averageRating owner",
  populate: {
    path: "owner reviews"
  },
  debug: true
});

let Model = mongoose.model("Blog", BlogSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  searchableAttributes: ["title"]
});*/

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
