const amqp = require("amqplib")
const config = require("./config")

 class Producer {
     channel;

  
    async createChannel() {
        const connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingkey, message) {
        if (!this.channel) {
            await this.createChannel();
        }

        const exchangeName = config.rabbitMQ.exchangeName;
        if (!this.channel) {
            throw new Error('Channel is not initialized');
        }
        await this.channel.assertExchange(exchangeName, "direct");

        const logDetails = {
            logType: routingkey,
            message: message,
            dateTime: new Date().toISOString() // Corrected typo and changed to ISO string
        };

        if (!this.channel) {
            throw new Error('Channel is not initialized');
        }
        await this.channel.publish(
            exchangeName,
            routingkey,
            Buffer.from(JSON.stringify({ logDetails }))
        );

        console.log(`The message ${message} is sent to exchange ${exchangeName}`);
    }
}

module.exports = Producer
