module.exports = (service) => {
    return async (req, res, next) => {
        const userId = req.uid
        const listId = req.path.substr(6,1)
        const usersList = await service.getAuthorisedListUsers(listId)

        if (usersList === null) {
            res.status(404).send('Invalid list')
        } else if (usersList.uid.includes(userId)) {
            return next()
        } else {
            res.status(403).send('Unauthorized user for list')
        }
        
    }
}