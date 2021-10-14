const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const db = {
    ...require('./lists')(pool),
    ...require('./tasks')(pool),
    ...require('./users')(pool)
}

db.initialise = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS Users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) NOT NULL,
            password_hash VARCHAR(100) NOT NULL
        )
    `)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS Lists (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            uid INTEGER ARRAY NOT NULL
            )
    `)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS Tasks (
            id SERIAL PRIMARY KEY,
            description VARCHAR(255) NOT NULL,
            completed BOOLEAN NOT NULL,
            list_id INTEGER NOT NULL,
            FOREIGN KEY (list_id) REFERENCES Lists(id)
        )
    `)

}
db.clearUsersTables = async () => {
    await pool.query('DELETE FROM Users')
    await pool.query('ALTER SEQUENCE users_id_seq RESTART')
}

db.clearListsTables = async () => {
    await pool.query('DELETE FROM Lists')
    await pool.query('ALTER SEQUENCE lists_id_seq RESTART')
}

db.clearTasksTables = async () => {
    await pool.query('DELETE FROM Tasks')
    await pool.query('ALTER SEQUENCE tasks_id_seq RESTART')
}

db.end = async () => {
    await pool.end()
}

module.exports = db