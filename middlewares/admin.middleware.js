// eslint-disable-next-line no-unused-vars
const { status, UserTypes, Context } = require('../constants')
const { message } = require('../constants/messages.constants')
const { getPayload } = require('../helpers/index.helper')
const { responseStructure: rs } = require('../helpers/response.helper')

/**
 * @function authAdmin
 * @description authAdmin
 * @param {typeof Context} ctx
 * @returns
 */
exports.authAdmin = (ctx) => {
  const user = getPayload(ctx.request)
  if (user.userType === UserTypes.admin) {
    ctx.next()
  } else {
    ctx.setStatus(status.unauthorized)
    return rs(status.unauthorized, message.unauthorized)
  }
}
