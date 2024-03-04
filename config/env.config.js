// config.js
const dotenv = require('dotenv')

const envVars = dotenv.config()
if (envVars.error) {
  console.log('Unable to process environment variables')
  process.exit(1)
}

const { NODE_ENV, MONGO_URL, ENCRYPTION_KEY, JWT_KEY, PORT } = process.env

module.exports = {
  env: NODE_ENV,
  port: PORT,
  mongo_url: MONGO_URL,
  encryption_key: ENCRYPTION_KEY,
  jwt_key: JWT_KEY
}
