import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
})

// Define a virtual property to return _id as id as a string
userSchema.virtual('id').get(function () {
  return this._id.toString()
})

// Remove __v and _id from the JSON representation of the user
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id
    delete ret.__v
  },
})

const User = model('User', userSchema)

export default User
