const Task = require("../models/task");

module.exports = (pool) => {
    const db = {};

    db.createTask = async (task) => {
        const res = await pool.query(
            "INSERT INTO Tasks(description,completed,list_id) VALUES ($1,$2,$3) RETURNING *",
            [task.description, task.completed, task.list_id]
        );
        
        return new Task(res.rows[0]);
    };

    db.updateTask = async (id, task) => {
        const res = await pool.query(
            "UPDATE Tasks SET description=$2, completed=$3, list_id=$4 WHERE id=$1 RETURNING *",
            [id, task.description, task.completed, task.list_id]
        );
        return new Task(res.rows[0])
    };

    db.deleteTask = async (id) => {
        const res = await pool.query("DELETE FROM Tasks WHERE id=$1", [id]);
        return res.rowCount > 0;
    };

    db.getAllTasksById = async (id) => {
        const res = await pool.query("SELECT * FROM Tasks WHERE list_id=$1", [id]);
        return res.rows.map(row => new Task(row))
    }

    return db
};
