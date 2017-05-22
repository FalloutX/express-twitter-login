import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  _id: String,
  username: String,
  displayName: String,
  photo: String,
  followers: Number,
  following: Number,
  accessToken: String,
  accessTokenSecret: String
})

export default mongoose.model('User', userSchema)
