const amqp = require("amqplib");
const { sendReminderEmail } = require("./emailService");

const QUEUE_NAME = "appointment_reminders";

const processQueue = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log("⏳ Processing reminder queue...");
        
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const { email, doctorName } = JSON.parse(msg.content.toString());
                await sendReminderEmail(email, doctorName);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("❌ Queue processing error:", error);
    }
};

module.exports = { processQueue };
