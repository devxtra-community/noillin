const amqp = require("amqplib");
async function run() {
  const conn = await amqp.connect("amqp://localhost:5672");
  const ch = await conn.createChannel();
  const queue = "gig_request.created";
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify({ id: "123", brandId: "b1", influencerId: "i1" })));
  console.log("Sent message to", queue);
  setTimeout(() => process.exit(0), 500);
}
run().catch(console.error);
