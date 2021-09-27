class Task {
    constructor({id, description, completed, list_id }) {
        this.id = id
        this.description = description
        this.completed = completed
        this.list_id = list_id
    }
}

module.exports = Task