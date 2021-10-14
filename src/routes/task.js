const express = require('express');
const Task = require('../models/task')

module.exports = (db) => {
    const router = express.Router()

    router.post('/', async (req, res) => {
        const listId = parseInt(req.query.list)
        const { description } = req.body
        const newTask = new Task({ description, completed: false, list_id: listId })

        try {
            const task = await db.createTask(newTask)
            res.status(201).send(task)
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    })

    router.patch('/', async (req, res) => {
        const listId = parseInt(req.query.list)
        const taskId = parseInt(req.query.task)
        const { description, completed } = req.body
        const newTask = new Task({ description, completed: completed, list_id: listId })

        try {
            const task = await db.updateTask(taskId, newTask)
            res.status(200).send(task)
        } catch (e) {
            res.status(400).send({error: 'task not updated'})
        }
    })

    router.delete('/', async (req, res) => {
        const taskId = req.query.task
        try {
            const success = await db.deleteTask(taskId)
            if (success) {
                res.status(201).send("Task Deleted!")
            } else {
                res.status(400).send("Task not found for user, check permissions")
            }
        } catch (e) {
            res.status(400).send(e)
        }
    })

    return router
}