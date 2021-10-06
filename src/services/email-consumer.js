const amqplib = require('amqplib')

module.exports = (db) => {
    const service = {}

    service.consumeEmail = async () => { 
        const client = await amqplib.connect(process.env.CLOUDAMQP_URL)
        const channel = await client.createChannel()
        await channel.assertQueue(process.env.QUEUE)
        channel.consume(process.env.QUEUE, async (msg) => {
            const data = JSON.parse(msg.content)
            console.log(data)
            try {
                const user = await db.findUserByEmail(data.email)
                if (user) {
                    await db.updateListUsers(parseInt(data.listId), parseInt(user.id))
                }
                channel.ack(msg)
            } catch (error) {
                console.log(error)
            }
        })
    }

    return service
}