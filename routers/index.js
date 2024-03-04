const { routerPath, baseEndpoint } = require('../config/router.config')
const { RequestMethod } = require('../constants')
const { message } = require('../constants/messages.constants')
const { getRoutesArray } = require('../helpers/routes.helper')
const path = require('path')

const useHandler = (handler) => {
  return async (request, response, next) => {
    const ctx = {
      request,
      response,
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
      get: request.get,
      setStatus: response.status,
      next: () => 'next'
    }
    const data = await handler(ctx)
    if (typeof data === 'string' && data === 'next') {
      next()
    } else {
      return response.send(data)
    }
  }
}

module.exports = (app, express) => {
  const router = express.Router()
  const dirPath = path.resolve(routerPath)
  const routes = getRoutesArray(dirPath)

  routes.forEach((route) => {
    const handlers = route.handlers.map(h => useHandler(h))
    switch (route.method) {
      case RequestMethod.put: {
        router.put(route.endpoint, ...handlers)
        break
      }
      case RequestMethod.get: {
        router.get(route.endpoint, ...handlers)
        break
      }
      case RequestMethod.delete: {
        router.delete(route.endpoint, ...handlers)
        break
      }
      case RequestMethod.post: {
        router.post(route.endpoint, ...handlers)
        break
      }
      default: {
        console.error(message.requestMethodError)
      }
    }
  })

  app.use(baseEndpoint, router)
}
