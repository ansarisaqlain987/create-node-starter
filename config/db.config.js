const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('connected')
})
mongoose.connection.on('error', () => {
  console.log('error')
})
exports.mongo_connection = mongoose.connection
