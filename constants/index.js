exports.status = {
  success: 200,
  createdSuccess: 201,
  noRecords: 204,
  badRequest: 400,
  unauthorized: 401,
  otpFailure: 406,
  methodNotAllowed: 405,
  conflict: 409,
  fileTypeError: 415,
  sessionExpired: 440,
  failure: 500
}

exports.RecordStatus = {
  active: 'active',
  inactive: 'inactive',
  all: 'all',
  getAllStatus: () => {
    return [this.active, this.inactive]
  }
}

exports.UserTypes = {
  admin: 'admin',
  user: 'user'
}

exports.RequestMethod = {
  put: 'PUT',
  get: 'GET',
  delete: 'DELETE',
  post: 'POST'
}

exports.systemUser = 'admin@broadstairs.in'

exports.SelectType = {
  select: 'select',
  deSelect: 'deSelect'
}

exports.Context = {
  request: {},
  response: {},
  body: {},
  params: {},
  query: {},
  headers: {},
  get: () => '',
  setStatus: (sts) => undefined,
  next: () => 'next'
}
