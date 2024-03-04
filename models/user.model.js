const { UserTypes } = require('../constants')
const { BaseSchema, extend } = require('./base.model')
const mongoose = require('mongoose')
const userSchema = extend(BaseSchema, {
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: false },
  gender: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: false },
  userType: {
    type: String,
    enum: Object.values(UserTypes),
    default: UserTypes.user
  }
})
exports.UserSchema = mongoose.model('users', userSchema)
