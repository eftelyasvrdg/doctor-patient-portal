const amqp = require("amqplib");

const QUEUE_NAME = "appointment_reminders";
let channel;

const connectToQueue = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost"); 
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log("✅ Connected to RabbitMQ Queue");
    } catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error);
    }
};

const addToQueue = async (email, doctorName) => {
    if (!channel) await connectToQueue();
    const reminder = JSON.stringify({ email, doctorName });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(reminder), { persistent: true });
    console.log(`📩 Reminder added for ${email} (Doctor: ${doctorName})`);
};

module.exports = { connectToQueue, addToQueue };
