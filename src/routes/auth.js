const express = require('express');

module.exports = (service) => {
    const router = express.Router()

    router.post('/register', async (req, res) => {
        const { email, password } = req.body
        const token = await service.registerUser(email, password)
        if (token) {
            res.send({ token: token})
        } else {
            res.status(400).send(`Email has already been registered`)
        }
    })

    router.post('/login', async (req, res) => {
        const { email, password } = req.body
        const token = await service.loginUser(email, password) 
        if (token) {
            res.send({ token: token})
        } else {
            res.status(400).send(`Invalid login credentials`)
        }
    })

    return router
}