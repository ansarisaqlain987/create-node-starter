const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const config = require('./config')
const port = config.env.port

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nodejs API',
      version: '1.0.0',
      description: 'NodejS Express library'
    },
    servers: [
      {
        url: `http://localhost:${port}`
      }
    ]
  },
  apis: ['./controllers/*.js']
}

const specs = swaggerJsDoc(options)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
require('./routers')(app, express)

// MARK:- Error if any one will hit url not found
app.use((req, res) => {
  res.status(404).json({
    Error: 'url not found'
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
