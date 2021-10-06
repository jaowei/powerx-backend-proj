const { getMockReq, getMockRes } = require('@jest-mock/express')
const ListAuthMiddleware = require('./list-auth')

const service = {
    getAuthorisedListUsers: jest.fn()
}

const listAuthMiddleware = ListAuthMiddleware(service)

describe('List authentication middleware', () => {
    let req
    beforeEach(() => {
      req = getMockReq({
        uid: 1,
        query: {
            list: [1]
        }
    })
    })

    describe('given a valid list', () => {
        describe('given an authorised user', () => {
            it('next should be called', async () => {
                service.getAuthorisedListUsers.mockReturnValue({
                    uid: [1]
                })
                const { res, next } = getMockRes()
                listAuthMiddleware(req, res, next)
                expect(next).toBeCalled()
            })
        })

        describe('given an unauthorised user', () => {
            it('should return 403', async () => {
                service.getAuthorisedListUsers.mockReturnValue({
                    uid: [2]
                })
                const { res, next } = getMockRes()
                listAuthMiddleware(req, res, next)
                expect(next).not.toBeCalled()
                expect(res.status).toBeCalledWith(403)
            })
        })
    })

    describe('given an invalid list', () => {
        it('should return 404', async () => {
            service.getAuthorisedListUsers.mockReturnValue(null)
            const { res, next } = getMockRes()
            listAuthMiddleware(req, res, next)
            expect(next).not.toBeCalled()
            expect(res.status).toBeCalledWith(404)
        })
    })
})