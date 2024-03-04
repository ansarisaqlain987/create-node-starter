// eslint-disable-next-line camelcase
const { jwt_key } = require('../config/env.config')
const { status } = require('../constants')
const { message } = require('../constants/messages.constants')
const jwt = require('jsonwebtoken')
const { setPayload } = require('../helpers/index.helper')
const { responseStructure: rs } = require('../helpers/response.helper')

exports.verifyToken = (req, res, next) => {
  const tokenString = req.get('Authorization')
  try {
    const parts = tokenString.split(' ')
    const token = parts[1]
    if (!token) {
      return res
        .status(status.success)
        .send(rs(status.unauthorized, message.unauthorized))
    }
    const user = jwt.verify(token, jwt_key)
    setPayload(req, user)
    next()
  } catch (error) {
    res
      .status(status.unauthorized)
      .send(rs(status.unauthorized, message.unauthorized, error))
  }
}
