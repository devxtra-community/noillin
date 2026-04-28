import mongoose from 'mongoose';

import { MessageModel } from './src/models/chat.model.ts';


async function test() {
    await mongoose.connect('mongodb+srv://Admin:admin@cluster0.2cvxsaj.mongodb.net/noillin');

    const msgs = await MessageModel.find().lean();
    console.log("All messages:", msgs);

    // Take the first message sender and run aggregate
    if (msgs.length > 0) {
        const senderStr = msgs[msgs.length - 1].senderId.toString();
        console.log("Testing with user:", senderStr);

        const userObjectId = new mongoose.Types.ObjectId(senderStr);
        const result = await MessageModel.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userObjectId },
                        { receiverId: userObjectId },
                    ],
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$gigRequestId",
                    senderId: { $first: "$senderId" },
                    receiverId: { $first: "$receiverId" },
                },
            },
            {
                $addFields: {
                    otherUserId: {
                        $cond: [
                            { $eq: ["$senderId", userObjectId] },
                            "$receiverId",
                            "$senderId",
                        ],
                    },
                },
            }
        ]);
        console.log("Result:", result);
    } else {
        console.log("No messages in DB.");
    }
    process.exit();
}
test();
