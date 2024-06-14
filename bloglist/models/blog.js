const mongoose = require("mongoose")
const { Schema } = mongoose

const blogSchema = new Schema({
    title: {
      type: String,
      required: true,

    },
    author: {
      type: String,
      required: true
    },
    url: {
      type: String, 
      required: true},
    likes: {
      type: Number,
      default: 0
    },
    user: [{
      type: Schema.Types.ObjectId,
      ref: "User"

    }]
})

blogSchema.set('toJSON', {
  transform: (doc, returned) => {
    returned.id = returned._id.toString();
    delete returned._id;
    delete returned.__v;
  }
})

module.exports = mongoose.model("Blog", blogSchema)
