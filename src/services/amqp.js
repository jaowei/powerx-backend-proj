require('dotenv').config()
const amqplib = require('amqplib')

const URL = process.env.CLOUDAMQP_URL || 'amqp://localhost'
const QUEUE = process.env.QUEUE

module.exports = () => {
    const service = {}

    service.publishUserAddition = async (message) => {
        const client = await amqplib.connect(URL)
        const channel = await client.createChannel()
        await channel.assertQueue(QUEUE)
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)),{
            contentType: 'application/json',
        })
        await channel.close()
        await client.close()
    }

    return service
}