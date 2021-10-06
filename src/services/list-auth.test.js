require('dotenv').config();
const ListAuthService = require('./list-auth')

const db = {
    getAllUsersByList: jest.fn(async () => {
        return {
            uid: [1,2,3]
        }
    })
}

const listAuthService = ListAuthService(db);

describe('Check user id for specific list', () => {
    describe('given an invalid list id', () => {
        it('should return null', async () => {
            db.getAllUsersByList.mockResolvedValueOnce(null);
            const users = await listAuthService.getAuthorisedListUsers('invalid id')
            expect(users).toBeFalsy();
        })
    })

    describe('given a valid list id', () => {
        it('should return an array', async () => {
            const users = await listAuthService.getAuthorisedListUsers(1)
            expect(users).toBeTruthy()
        })
    })
})