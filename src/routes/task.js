const express = require('express');
const Task = require('../models/task')

module.exports = (db) => {
    const router = express.Router()

    router.post('/:id', async (req, res) => {
        const uid = req.uid
        const listId = req.params.id
        const { description } = req.body
        const newTask = new Task({ description, completed: false, list_id: listId })
        try {
            const task = await db.createTask(newTask, uid)
            res.status(201).send(task)
        } catch (e) {
            res.status(400).send(e)
        }
    })

    return router
}