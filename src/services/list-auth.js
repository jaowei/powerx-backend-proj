module.exports = (db) => {
    const service = {}

    service.getAuthorisedListUsers = async (id) => {
        const authUsers = await db.getAllUsersByList(id)
        return authUsers
    }

    return service
}