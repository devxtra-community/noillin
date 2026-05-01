/* global console, process, setTimeout */
import { connectRabbit} from "./apps/core-api/src/queue/rabbit.js";
import { publishEvent } from "./apps/core-api/src/queue/publisher.js";

async function run() {
  await connectRabbit();
  await publishEvent("gig_request.created", {
      id: "123",
      brandId: "b1",
      influencerId: "i1",
      gigId: "g1",
      note: "test"
  });
  console.log("Published!");
  setTimeout(() => process.exit(0), 1000);
}
run().catch(console.error);
