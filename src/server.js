require('dotenv').config()
const App = require('./app')
const Router = require('./routes')
const AuthService = require('./services/auth')
const db = require('./db')
const AuthMiddleware = require('./middleware/auth')
const ListAuthService = require('./services/list-auth')
const ListAuthMiddleware = require('./middleware/list-auth')
const EmailConsumerService = require('./services/email-consumer')
const AmqpService = require('./services/amqp')

const amqpService = AmqpService()
const emailConsumerService = EmailConsumerService(db)
const authService = AuthService(db)
const authMiddleware = AuthMiddleware(authService)
const listAuthService = ListAuthService(db)
const listAuthMiddleware = ListAuthMiddleware(listAuthService)

const router = Router(authMiddleware, authService, listAuthMiddleware, amqpService, db)
const app = App(router)
emailConsumerService.consumeEmail()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})