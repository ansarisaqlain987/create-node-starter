const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL)
exports.mongo_connection = mongoose.connection
