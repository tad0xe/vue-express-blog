const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  type:{

    type: String,
    unique: true,
    required: true
  },
  photo: String,
  blogs: [
    {
      blogID: { type: Schema.Types.ObjectId, ref: "Blog" },

    }
  ]

});

CategorySchema.plugin(deepPopulate)
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
