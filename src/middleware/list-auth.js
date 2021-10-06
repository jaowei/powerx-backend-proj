module.exports = (service) => {
    return async (req, res, next) => {
        const userId = req.uid
        const listId = parseInt(req.query.list)
        const usersList = await service.getAuthorisedListUsers(listId)

        if (usersList === null) {
            res.status(404).send('Invalid list')
        } else if (usersList.uid.includes(userId)) {
            return next()
        } else {
            res.status(403).send({error: 'Unauthorized user for list'})
        }
        
    }
}