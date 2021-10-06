const List = require('../models/list')

module.exports = (pool) => {
    const db = {}

    db.createList = async (list) => {
        const res = await pool.query(
            'INSERT INTO Lists(title,uid) VALUES($1,$2) RETURNING *',
            [list.title, list.uid]
        )
        return new List(res.rows[0])
    }

    db.getAllListsByUser = async (uid) => {
        const res = await pool.query('SELECT title FROM Lists WHERE $1= ANY (uid)', [uid])
        return res.rows.map(row => new List(row))
    }

    db.getAllUsersByList = async (id) => {
        const res = await pool.query('SELECT uid FROM Lists WHERE id=$1', [id])
        return res.rowCount ? res.rows[0] : null
    }

    db.getListByUser = async (id, uid) => {
        const res = await pool.query(
            'SELECT * FROM Lists WHERE $1= ANY (uid) AND id=$2',
            [uid, id]
        )
        return new List(res.rows[0])
    }

    db.updateListByUser = async (id, uid, list) => {
        const res = await pool.query(
            'UPDATE Lists SET title=$1 WHERE id=$2 AND $3= ANY (uid) RETURNING *', 
            [list.title, id, uid]
        )
        return new List(res.rows[0])
    }

    db.updateListUsers = async (id, uid) => {
        const res = await pool.query(
            'UPDATE Lists SET uid = array_append(uid, $1) WHERE id=$2 RETURNING *',
            [uid, id]
        )
        return new List(res.rows[0])
    }

    db.deleteListByUser = async (id, uid) => {
        const res = await pool.query(
            'DELETE FROM Lists WHERE id=$1 AND $2= ANY (uid)',
            [id, uid]
        )
        return res.rowCount > 0
    }

    return db
}