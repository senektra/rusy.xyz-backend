import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateModified: {
    type: Date,
    default: Date.now,
  },
})

blogSchema.set('toJSON', {
  transform: function (_doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog
