import mongoose from "mongoose";

const Enroll = mongoose.model(
    "Enroll",
    new mongoose.Schema({
        startDate: String,
        endDate: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        specialistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Specialist',
        },
        type: String,
        comments: String,
    })
);

export default Enroll;
