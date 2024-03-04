const { status, UserTypes } = require('../constants')
const { message } = require('../constants/messages.constants')
const { getPayload } = require('../helpers/index.helper')
const { responseStructure: rs } = require('../helpers/response.helper')

exports.authAdmin = (req, res, next) => {
  const user = getPayload(req)
  if (user.userType === UserTypes.admin) {
    next()
  } else {
    res
      .status(status.unauthorized)
      .send(rs(status.unauthorized, message.unauthorized))
  }
}
