const userdb = require('../database/user.db')
const { status } = require('../constants')
const { message } = require('../constants/messages.constants')
const { responseStructure: rs } = require('../helpers/response.helper')
const { updateFilters, FiltersMeta } = require('../helpers/filter.helpers')
const { getSelectString, SelectMeta } = require('../helpers/dbselect.helper')
const { getCleanObject, getPayload } = require('../helpers/index.helper')
// eslint-disable-next-line camelcase
const { jwt_key } = require('../config/env.config')
const jwt = require('jsonwebtoken')
const {
  isRequestBodyForAddRecordValid,
  isRequestBodyForUpdateRecordValid,
  getObjectWithValidFields
} = require('../helpers/validation.helper')
const { UserSchema } = require('../models/user.model')

/**
 * @swagger
 * components:
 *   securitySchemes:
 *    bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 *   security:
 *     - bearerAuth: []
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         fullName:
 *           type: string
 *           description: User name
 *         dateOfBirth:
 *           type: Date
 *           description: Date of birth of the user
 *         gender:
 *           type: string
 *           description: Gender of the user.
 *         email:
 *           type: string
 *           description: Email of the user. This is unique for every user
 *         password:
 *           type: string
 *           description: This is an encrypted password of the user, only user has the original password.
 *         mobile:
 *           type: string
 *           description: Phone number of the user.
 *         userType:
 *           type: string
 *           description: Type of user on the platform.
 *
 *       example:
 *         _id: uauysdtyuasd675a76s5d6a5sd7a5s6d45a
 *         fullName: Mohammad Adnan
 *         dateOfBirth: 01/02/2001
 *         gender: Male
 *         email: mohammadadnan@gmail.com
 *         mobile: 9874563524
 *         password: iuas7d57asdfahgsdjafd56qw4ej
 *         userType: student
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: email of the user
 *         password:
 *           type: string
 *           description: User password
 *
 *   responses:
 *    UnauthorizedError:
 *     description: Access token is missing or invalid
 *     schema:
 *        status: number
 *        message: string
 *     example:
 *        status: 401
 *        message: Unauthorized access.
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 */

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Adds user to the portal
 *     tags: [User]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       description: Required data has to be given to add user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             fullName: Mohammad Adnan
 *             dateOfBirth: 01/02/2001
 *             gender: Male
 *             email: mohammadadnan@gmail.com
 *             mobile: 9874563524
 *             password: broadstairs@123
 *     responses:
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/responses/UnauthorizedError'
 *       201:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *               status:
 *                  type: integer
 *               message:
 *                  type: string
 *             example:
 *                  status: 201
 *                  message: User added successfully
 *
 */

// Add user
exports.addUser = async (req, res) => {
  const jsonData = req.body

  const { isValid, missingFields, validFields } =
    isRequestBodyForAddRecordValid(jsonData, UserSchema.schema)
  if (!isValid) {
    return res
      .status(status.badRequest)
      .send(rs(status.badRequest, message.missingFields, { missingFields }))
  }

  const validObject = getObjectWithValidFields(jsonData, validFields)

  userdb
    .addUser(validObject, jsonData.email)
    .then((response) => {
      res
        .status(status.success)
        .send(rs(status.success, message.addUserSuccess))
    })
    .catch((error) => {
      res
        .status(status.failure)
        .send(rs(status.failure, message.addUserError, error))
    })
}

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users data
 *     parameters:
 *       - in: query
 *         name: status
 *         description: Record status active ,inactive, all, by default it is active
 *       - in: query
 *         name: type
 *         description: user type
 *       - in: query
 *         name: gender
 *         description: Gender of the user
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     responses:
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/UnauthorizedError'
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 200
 *               message: All users data fetched successfully
 */

// get all users
exports.getUsers = (req, res) => {
  const queryParams = req.query
  updateFilters(queryParams, FiltersMeta.users)
  const selectString = getSelectString(SelectMeta.default, SelectMeta.users)
  userdb
    .getUsers(queryParams, { select: selectString })
    .then((users) => {
      res
        .status(status.success)
        .send(rs(status.success, message.getAllStudents, users))
    })
    .catch((error) => {
      res
        .status(status.failure)
        .send(rs(status.failure, message.internalServerError, error))
    })
}

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get single user data
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The ID of the user to fetch
 *         required: true
 *         schema:
 *           type: string
 *           example: 857698dngjdnfhdgrhb
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/UnauthorizedError'
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 200
 *               message: Single user data fetched successfully
 */

// Get single user data
exports.singleUser = (req, res) => {
  const userId = req.params.id

  if (!userId) {
    return res
      .status(status.badRequest)
      .send(rs(status.badRequest, message.noUniqueId))
  }

  const selectString = getSelectString(SelectMeta.default, SelectMeta.users)
  userdb
    .getUsers({ _id: userId }, { select: selectString })
    .then((users) => {
      if (users.length > 0) {
        console.log(users)
        res
          .status(status.success)
          .send(rs(status.success, message.singleStudent, users[0]))
      } else {
        res
          .status(status.success)
          .send(rs(status.noRecords, message.noRecords))
      }
    })
    .catch((error) => {
      res
        .status(status.failure)
        .send(rs(status.failure, message.internalServerError, error))
    })
}

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete user data
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The ID of the user to delete
 *         required: true
 *         schema:
 *           type: string
 *           example: 857698dngjdnfhdgrhbkdjgbfcbgk
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/UnauthorizedError'
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 200
 *               message: User delete successfully
 */

// delete user
exports.deleteUser = (req, res) => {
  const userId = req.params.id
  if (!userId) {
    return res
      .status(status.badRequest)
      .send(rs(status.badRequest, message.noUniqueId))
  }
  userdb
    .deleteUser(userId)
    .then((response) => {
      res
        .status(status.success)
        .send(rs(status.success, message.deleteUser, response))
    })
    .catch((error) => {
      res
        .status(status.failure)
        .send(rs(status.failure, message.internalServerError, error))
    })
}

/**
 * @swagger
 * /users:
 *   post:
 *     summary: User update to the portal
 *     tags: [User]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       description: Required data has to be given to update user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             _id: "65d59ce64af3df2c810a4e11"
 *             fullName: Bhaijaan
 *             dateOfBirth: 01/02/2001
 *             gender: Male
 *             email: waseembhaijaan@gmail.com
 *             mobile: 9874563524
 *             password: broadstairs@123
 *     responses:
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/responses/UnauthorizedError'
 *       201:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *               status:
 *                  type: integer
 *               message:
 *                  type: string
 *             example:
 *                  status: 200
 *                  message: User update successfully
 *
 */

// update user
exports.updateUser = async (req, res) => {
  const decoded = getPayload(req)
  const jsonData = req.body
  const userId = jsonData._id
  const { isValid, validFields } = isRequestBodyForUpdateRecordValid(
    jsonData,
    UserSchema.schema
  )

  if (!isValid) {
    return res
      .status(status.badRequest)
      .send(rs(status.badRequest, message.noUpdateFields))
  }

  const validObject = getObjectWithValidFields(jsonData, validFields)

  userdb
    .updateUser(userId, validObject, decoded.email)
    .then((response) => {
      res.status(status.success).send(rs(status.success, message.userUpdate))
    })
    .catch((error) => {
      res
        .status(status.failure)
        .send(rs(status.failure, message.internalServerError, error))
    })
}

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentic user for the portal
 *     tags: [User]
 *     requestBody:
 *       description: Required data has to be given to login user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *           example:
 *             email: mohammadadnan@gmail.com
 *             password: broadstairs@123
 *     responses:
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/responses/UnauthorizedError'
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *               status:
 *                  type: integer
 *               message:
 *                  type: string
 *               accessToken:
 *                  type: string
 *             example:
 *                  status: 200
 *                  message: User authenticated
 *                  accessToken: kajsgda8s76d76a4s56d4quwfe23r762537rafsjdhfay5sd76as4f65drguisdhkugft7a4s6d54as5d
 *
 */

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!email && !password) {
    return res
      .status(status.success)
      .send(rs(status.unauthorized, message.unauthorized))
  }
  try {
    const users = await userdb.getUsers({ email }, { lean: true })
    if (users.length > 0) {
      const user = users[0]
      if (user.password === password) {
        const accessToken = jwt.sign(
          getCleanObject(user, SelectMeta.default, SelectMeta.users),
          jwt_key,
          {
            expiresIn: '24hr'
          }
        )

        const refreshToken = jwt.sign(
          getCleanObject(user, SelectMeta.default, SelectMeta.users),
          jwt_key,
          {
            expiresIn: '7d'
          }
        )

        res.status(status.success).send(
          rs(status.success, 'User authenticated', {
            accessToken,
            refreshToken
          })
        )
      } else {
        res
          .status(status.unauthorized)
          .send(rs(status.unauthorized, 'User not authenticated'))
      }
    } else {
      res.status(status.success).send(rs(status.noRecords, message.noRecords))
    }
  } catch (error) {
    console.log(error)
    res
      .status(status.failure)
      .send(rs(status.failure, message.addUserError, error))
  }
}

/**
 * @swagger
 * /refreshToken:
 *   post:
 *     summary: Get updated JWT token for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     responses:
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/responses/UnauthorizedError'
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *               status:
 *                  type: integer
 *               message:
 *                  type: string
 *               accessToken:
 *                  type: string
 *             example:
 *                  status: 200
 *                  message: User authenticated
 *                  accessToken: kajsgda8s76d76a4s56d4quwfe23r762537rafsjdhfay5sd76as4f65drguisdhkugft7a4s6d54as5d
 *
 */

// Login user
exports.refreshToken = async (req, res) => {
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
    delete user.iat
    delete user.exp
    const accessToken = jwt.sign(user, jwt_key, {
      expiresIn: '24hr'
    })

    const refreshToken = jwt.sign(user, jwt_key, {
      expiresIn: '7d'
    })

    res.status(status.success).send(
      rs(status.success, 'User authenticated', {
        accessToken,
        refreshToken
      })
    )
  } catch (error) {
    res
      .status(status.failure)
      .send(rs(status.failure, message.internalServerError, error))
  }
}
