const { RequestMethod } = require('../constants')
const controller = require('../controllers/user.controller')
const { Endpoints } = require('../constants/endpoints.constants')
const { verifyToken } = require('../middlewares/auth.middleware')
const { authAdmin } = require('../middlewares/admin.middleware')

exports.routes = [
  {
    method: RequestMethod.put,
    endpoint: Endpoints.users,
    handlers: [verifyToken, authAdmin, controller.addUser]
  },
  {
    method: RequestMethod.get,
    endpoint: Endpoints.users,
    handlers: [verifyToken, controller.getUsers]
  },
  {
    method: RequestMethod.get,
    endpoint: Endpoints.users + '/:id',
    handlers: [verifyToken, controller.singleUser]
  },
  {
    method: RequestMethod.delete,
    endpoint: Endpoints.users + '/:id',
    handlers: [controller.deleteUser]
  },
  {
    method: RequestMethod.post,
    endpoint: Endpoints.users,
    handlers: [verifyToken, controller.updateUser]
  },
  {
    method: RequestMethod.post,
    endpoint: Endpoints.login,
    handlers: [controller.login]
  },
  {
    method: RequestMethod.post,
    endpoint: Endpoints.refreshToken,
    handlers: [controller.refreshToken]
  }
]
