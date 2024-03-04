const { SelectType } = require('../constants')

// array of metas should have same types
exports.getCleanObject = (object, ...metas) => {
  const returnObject = {}
  let fields = metas.map((meta) => meta.fields)
  fields = fields.flat()
  if (metas[0].type === SelectType.select) {
    Object.keys(object).forEach((key) => {
      if (fields.includes(key)) {
        returnObject[key] = object[key]
      }
    })
  } else {
    Object.keys(object).forEach((key) => {
      if (!fields.includes(key)) {
        returnObject[key] = object[key]
      }
    })
  }
  console.log(returnObject)
  return returnObject
}

exports.setPayload = (req, data) => {
  req.headers.decodedPayload = data
}

exports.getPayload = (req) => {
  return req.headers.decodedPayload
}
