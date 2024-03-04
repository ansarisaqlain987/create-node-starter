const { RecordStatus } = require('../constants')
const { UserSchema } = require('../models/user.model')

// Add user
exports.addUser = (userData, actionBy) => {
  return new Promise((resolve, reject) => {
    const user = new UserSchema({ ...userData, createdBy: actionBy })
    user
      .save()
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// get all users
/**
 *
 * @param {Object} filters
 * @param {Object} options with a type {select:string , lean: boolean}
 * @returns
 */
exports.getUsers = (filters, options) => {
  return new Promise((resolve, reject) => {
    UserSchema.find(filters)
      .select(options?.select)
      .lean(options ? options.lean ?? false : false)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// delete user
exports.deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    UserSchema.findByIdAndUpdate(userId, { recStatus: RecordStatus.inactive })

      .then((user) => {
        resolve(user)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// update user
exports.updateUser = (userId, userData, actionBy) => {
  return new Promise((resolve, reject) => {
    const params = {
      ...userData,
      updatedBy: actionBy,
      updatedAt: new Date()
    }
    UserSchema.findOneAndUpdate({ _id: userId }, params)
      .then(() => resolve())
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
