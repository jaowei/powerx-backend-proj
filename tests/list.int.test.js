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

describe('POST /list', () => {
    beforeAll(async () => {
        await db.clearTasksTables()
        await db.clearListsTables()
    })

    describe('create a list', () => {
        let id
        const list = {
            title: 'test_list',
        }

        it('should return 201', async () => {
            return await request(app)
                .post('/list')
                .set('Authorization', token)
                .send(list)
                .expect(201)
                .then(res => {
                    id = res.body.id
                    expect(res.body).toMatchObject(list)
                })
        })

        it('should return the item', async () => {
            return await request(app)
                .get(`/list/${id}`)
                .set('Authorization', token)
                .expect(200)
                .then(res => {
                    expect(res.body.list.title).toMatch(list.title)
                })
        })
    })
})

describe('GET /list', () => {
    describe('given no items in db', () => {
        beforeAll(async () => {
            await db.clearListsTables()
        })

        it('should return an empty array', async () => {
            return await request(app)
            .get(`/list`)
            .set('Authorization', token)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual([])
            })
        })
    })

    describe('given some items', () => {
        const lists = [
            { title: 'test1' },
            { title: 'test2' }
        ]

        beforeAll(async () => {
            await db.clearListsTables()
            await Promise.all(
                lists.map((list) => {
                    return request(app)
                        .post('/list')
                        .set('Authorization', token)
                        .send(list)
                })
            )
        })

        it('should return all items', async () => {
            return await request(app)
                .get(`/list`)
                .set('Authorization', token)
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual(
                        expect.arrayContaining(
                            lists.map((list) => {
                                return expect.objectContaining({
                                    title: list.title
                                })
                            })
                        )
                    )
                })
        })
    })
})

describe('PATCH /list', () => {
    beforeAll(async () => {
        await db.clearListsTables()
    })

    describe('update a list', () => {
        let id 
        const list = {
            title: 'test'
        }
        const updatedList = {
            title: 'test2'
        }

        beforeAll(async () => {
            return request(app)
                .post('/list')
                .set('Authorization', token)
                .send(list)
                .then((res) => {
                    id = res.body.id
                })
        })

        it('should return 200', async () => {
            return request(app)
                .patch(`/list/${id}`)
                .set('Authorization', token)
                .send(updatedList)
                .expect(200)
                .then((res) => {
                    expect(res.body).toMatchObject({
                        id: id,
                        title: updatedList.title,
                        uid: [1],
                    })
                })
        })

        it('should return the updated item', async () => {
            return request(app)
                .get(`/list/${id}`)
                .set('Authorization', token)
                .expect(200)
                .then((res) => {
                    expect(res.body).toMatchObject({
                        list: {
                            id: id,
                            title: updatedList.title,
                            uid: [1],
                        },
                        tasks: []
                    })
                })
        })
    })
})

describe('DELETE /list', () => {
    beforeAll(async () => {
        await db.clearListsTables()
    })

    describe('delete a list', () => {
        let id 
        const list = {
            title: 'test'
        }

        beforeAll(async () => {
            return request(app)
                .post('/list')
                .set('Authorization', token)
                .send(list)
                .then((res) => {
                    id = res.body.id
                })
        })

        it('should return 201', async () => {
            return request(app)
                .delete(`/list/${id}`)
                .set('Authorization', token)
                .expect(201)
                .then((res) => {
                    expect(res.body).toMatchObject({
                        message: 'List Deleted!'
                    })
                })
        })

        it('should return 400 when deleting non existent item', async () => {
            return request(app)
                .delete(`/list/${id}`)
                .set('Authorization', token)
                .expect(400)
                .then((res) => {
                    expect(res.body).toMatchObject({
                        error: 'List not found for user, check permissions'
                    })
                })
        })
    })
})