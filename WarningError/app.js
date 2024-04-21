const amqp = require("amqplib")

async function consumeMessages(){
    console.log("ddddddddddddddddd")
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertExchange("logExchange","direct");

    const q = await channel.assertQueue("WarningAndErrorsQueue")

    await channel.bindQueue(q.queue,"logExchange","Warning")
    await channel.bindQueue(q.queue,"logExchange","Error")


    channel.consume(q.queue,(msg)=>{
        const data = msg && msg.content ? JSON.parse(msg.content.toString()) : null;
        console.log("oooooooooooooo")
        console.log(data)
        if (msg) {
            channel.ack(msg);
        }
    })
}

consumeMessages()
