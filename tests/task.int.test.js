const request = require('supertest')
const utils = require('./utils')

const app = utils.app
const db = utils.db

let token

beforeAll(async () => {
    await utils.setup()
    token = await utils.registerUser()
})

afterAll(async () => {
    await utils.teardown()
})

describe('POST /task', () => {
    let listId
    const list = {
        title: 'test_list',
    }

    beforeAll(async () => {
        await db.clearTasksTables()
        await db.clearListsTables()

        return await request(app)
            .post('/list')
            .set('Authorization', token)
            .send(list)
            .then(res => {
                listId = res.body.id
            })
    })

    afterAll(async () => {
        await db.clearTasksTables()
        await db.clearListsTables()
    })

    describe('create a task', () => {
        let taskId
        const task = {
            description: 'test_description',
        }

        it('should return 201', async () => {
            return await request(app)
                .post('/task')
                .set('Authorization', token)
                .query({ list: 1 })
                .send(task)
                .expect(201)
                .then(res => {
                    taskId = res.body.id
                    expect(res.body).toMatchObject(task)
                })
        })
    })
})

describe('PATCH /task', () => {
    let listId
    const list = {
        title: 'test_list',
    }

    beforeAll(async () => {
        await db.clearTasksTables()
        await db.clearListsTables()

        return await request(app)
            .post('/list')
            .set('Authorization', token)
            .send(list)
            .then(res => {
                listId = res.body.id
            })
    })

    afterAll(async () => {
        await db.clearTasksTables()
        await db.clearListsTables()
    })

    describe('update a task', () => {
        let taskId
        const task = {
            description: 'test_description',
        }
        const updatedTask = {
            description: 'test_description2',
            completed: true
        }

        beforeAll(async () => {
            return await request(app)
                .post('/task')
                .set('Authorization', token)
                .query({ list: 1 })
                .send(task)
                .expect(201)
                .then(res => {
                    taskId = res.body.id
                })
        })


        it('should return 200', async () => {
            return request(app)
                .patch(`/task`)
                .set('Authorization', token)
                .query({ list: 1, task: 1 })
                .send(updatedTask)
                .expect(200)
                .then((res) => {
                    expect(res.body).toMatchObject({
                        completed: updatedTask.completed,
                        description: updatedTask.description,
                        id: taskId,
                        list_id: 1,
                    })
                })
        })
    })
})

describe('DELETE /task', () => {
    let listId
    const list = {
        title: 'test_list',
    }

    beforeAll(async () => {
        await db.clearTasksTables()
        await db.clearListsTables()

        return await request(app)
            .post('/list')
            .set('Authorization', token)
            .send(list)
            .then(res => {
                listId = res.body.id
            })
    })

    afterAll(async () => {
        await db.clearTasksTables()
        await db.clearListsTables()
    })

    describe('delete a task', () => {
        let taskId
        const task = {
            description: 'test_description',
        }

        beforeAll(async () => {
            return await request(app)
                .post('/task')
                .set('Authorization', token)
                .query({ list: 1 })
                .send(task)
                .expect(201)
                .then(res => {
                    taskId = res.body.id
                })
        })

        it('should return 201', async () => {
            return await request(app)
                .delete('/task')
                .set('Authorization', token)
                .query({ list: 1, task: 1 })
                .expect(201)
        })
    })
})