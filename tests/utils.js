require('dotenv').config({ path: '.env.test' })
const App = require('../src/app')
const Router = require('../src/routes')
const AuthMiddleware = require('../src/middleware/auth')
const AuthService = require('../src/services/auth')
const ListAuthMiddleware = require('../src/middleware/list-auth')
const ListAuthService = require('../src/services/list-auth')
const amqpService = require('../src/services/amqp')
const db = require('../src/db')

const utils = {}

const authService = AuthService(db)
const listAuthService = ListAuthService(db)
const authMiddleware = AuthMiddleware(authService)
const listAuthMiddleware = ListAuthMiddleware(listAuthService)
const router = Router(authMiddleware, authService, listAuthMiddleware, amqpService, db)
const app = App(router)

utils.app = app
utils.db = db

utils.setup = async () => {
    await db.initialise()
    await db.clearUsersTables()
    await db.clearListsTables()
    await db.clearTasksTables()
}

utils.teardown = async () => {
    await db.end()
}

utils.registerUser = async (email='test_user', password='test_password') => {
    const token = await authService.registerUser(email, password)
    return `Bearer ${token}`
}

module.exports = utils