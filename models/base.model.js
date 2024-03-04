const mongoose = require('mongoose')
const { RecordStatus } = require('../constants')

exports.BaseSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedBy: { type: String, required: false },
  updatedAt: { type: Date, required: false },
  recStatus: {
    type: String,
    enum: RecordStatus.getAllStatus(),
    default: RecordStatus.active
  }
})

// Extend function
exports.extend = (Schema, obj) =>
  new mongoose.Schema(Object.assign({}, Schema.obj, obj))
