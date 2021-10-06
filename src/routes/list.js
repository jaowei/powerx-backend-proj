const express = require('express');
const List = require('../models/list')
const amqplib = require('amqplib')

module.exports = (db, amqpService) => {
    const router = express.Router()

    router.post('/', async (req, res) => {
        const uid = req.uid
        const { title } = req.body
        const newList = new List({ title, uid: [uid] })
        try {
            const list = await db.createList(newList)
            res.status(201).send(list)
        } catch (e) {
            res.status(400).send(e)
        }
    })

    router.post('/access', async (req, res) => {
        const message = {
            email: req.body.email,
            listId: req.body.listId
        }

        try {
            await amqpService.publishUserAddition(message)
            res.status(200).send('Success')
        } catch (e) {
            res.status(400).send(e)
        }
    })

    router.get('/', async (req, res) => {
        const uid = req.uid
        try {
            const lists = await db.getAllListsByUser(uid)
            res.status(200).send(lists)
        } catch (e) {
            res.status(400).send(e)
        }
        
    })

    router.get('/:id', async (req, res) => {
        const id = req.params.id
        const uid = req.uid
        try {
            const list = await db.getListByUser(id, uid)
            const tasks = await db.getAllTasksById(id)
            res.status(200).send({list, tasks})
        } catch (e) {
            res.status(403).send({error: "Unauthorised User"})
        }
    })

    router.patch('/:id', async (req, res) => {
        const id = req.params.id
        const uid = req.uid
        const { title } = req.body
        const updatedList = new List({title})
        try {
            const list = await db.updateListByUser(id, uid, updatedList)
            res.status(200).send(list)
        } catch (e) {
            res.status(403).send({error: "Unauthorised User"})
        }
    })

    router.delete('/:id', async (req, res) => {
        const id = req.params.id
        const uid = req.uid
        try {
            const success = await db.deleteListByUser(id, uid)
            if (success) {
                res.status(201).send({error: "List Deleted!"})
            } else {
                res.status(400).send({error: "List not found for user, check permissions"})
            }
        } catch (e) {
            res.status(403).send({error: "Unauthorised User"})
        }
    })

    return router
}