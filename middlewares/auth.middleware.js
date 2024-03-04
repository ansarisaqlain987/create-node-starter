// eslint-disable-next-line camelcase
const { jwt_key } = require('../config/env.config')
// eslint-disable-next-line no-unused-vars
const { status, Context } = require('../constants')
const { message } = require('../constants/messages.constants')
const jwt = require('jsonwebtoken')
const { setPayload } = require('../helpers/index.helper')
const { responseStructure: rs } = require('../helpers/response.helper')

/**
 * @function verifyToken
 * @description verifyToken
 * @param {typeof Context} ctx
 * @returns
 */
exports.verifyToken = (ctx) => {
  const tokenString = ctx.get('Authorization')
  try {
    const parts = tokenString.split(' ')
    const token = parts[1]
    if (!token) {
      return rs(status.unauthorized, message.unauthorized)
    }
    const user = jwt.verify(token, jwt_key)
    setPayload(ctx.request, user)
    ctx.next()
  } catch (error) {
    ctx.setStatus(status.unauthorized)
    return rs(status.unauthorized, message.unauthorized, error)
  }
}
