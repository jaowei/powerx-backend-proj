const express = require('express');
const Task = require('../models/task')

module.exports = (db) => {
    const router = express.Router()

    router.post('/:listId', async (req, res) => {
        const listId = parseInt(req.params.listId)
        const { description } = req.body
        const newTask = new Task({ description, completed: false, list_id: listId })

        try {
            const task = await db.createTask(newTask)
            res.status(201).send(task)
        } catch (e) {
            res.status(400).send(e)
        }
    })

    router.patch('/', async (req, res) => {
        // const taskId = req.params.taskId
        // const listId = req.params.listId
        console.log(req.query)
        const { description, completed } = req.body
        const newTask = new Task({ description, completed: completed, list_id: listId })

        try {
            const task = await db.updateTask(taskId, newTask)
            res.status(200).send(task)
        } catch (e) {
            res.status(400).send(e)
        }
    })

    router.delete('/:listId/:taskId', async (req, res) => {
        const taskId = req.params.taskId
        console.log(req.query)
        try {
            const success = await db.deleteTask(taskId)
            if (success) {
                res.status(201).send("Task Deleted!")
            } else {
                res.status(400).send("Task not found")
            }
        } catch (e) {
            res.status(400).send(e)
        }
    })

    return router
}