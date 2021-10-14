const request = require('supertest')
const utils = require('./utils')

const app = utils.app
const db = utils.db

const email = 'test_user'
const password = 'test_password'

beforeAll(async () => {
    await utils.setup()
})

afterAll(async () => {
    await utils.teardown()
})

describe('GET /', () => {
    it('should return 200', async () => {
        return request(app)
            .get('/')
            .expect(200)
    })
})

describe('POST /register', () => {
    beforeAll(async () => {
        await db.clearUsersTables()
    })

    it('should return with a token', async () => {
        return request(app)
            .post('/register')
            .send({ email, password })
            .expect(200)
            .then(response => {
                expect(response.body.token).toBeTruthy()
            }) 
    })

    it('should reutrn 400 if user exists', async () => {
        return request(app)
            .post('/register')
            .send({ email, password })
            .expect(400)
            .then(res => {
                expect(res.body.token).toBeFalsy()
            })
    })
})

describe('POST /login', () => {
    beforeAll(async () => {
        await db.clearUsersTables()
        await utils.registerUser(email, password)
    })

    describe('valid login credentials', () => {
        it('should return with a token', async () => {
            return request(app)
                .post('/login')
                .send({ email, password })
                .expect(200)
                .then(res => {
                    expect(res.body.token).toBeTruthy()
                })
        })
    })

    describe('invalid login credentials', () => {
        it('should return with a token', async () => {
            return request(app)
                .post('/login')
                .send({ email, password:'invalid' })
                .expect(400)
                .then(res => {
                    expect(res.body.token).toBeFalsy()
                })
        })
    })
})