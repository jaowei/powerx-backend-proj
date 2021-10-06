const express = require('express')
const OpenApiValidator = require('express-openapi-validator')

module.exports = (authMiddleware, authService, listAuthMiddleware, amqpService, db) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    res.send('Hello world!')
  })

  // router.use(
  //   OpenApiValidator.middleware({
  //     apiSpec: './openapi.yaml',
  //     validateResponses: false
  //   })
  // )

  router.use('/', require('./auth')(authService))

  // All routes from this point will use the auth middleware
  router.use(authMiddleware)

  router.use('/list', require('./list')(db, amqpService))

  router.use(listAuthMiddleware)

  router.use('/task', require('./task')(db))

  router.use((err, req, res, next) => {
    // 7. Customize errors
    console.error(err); // dump error to console for debug
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  return router
}
