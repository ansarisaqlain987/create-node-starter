// config.js
const dotenv = require('dotenv')

dotenv.config()

const { NODE_ENV, MONGO_URL, ENCRYPTION_KEY, JWT_KEY, PORT } = process.env

module.exports = {
  env: NODE_ENV,
  port: PORT,
  mongo_url: MONGO_URL,
  encryption_key: ENCRYPTION_KEY,
  jwt_key: JWT_KEY
}
