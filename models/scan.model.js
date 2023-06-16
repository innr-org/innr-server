import mongoose from "mongoose";

const Scan = mongoose.model(
    "Scan",
    new mongoose.Schema({
        percent: Number,
        diseases: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Disease',
            },
        ],
        specialists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Specialist',
            },
        ],
        image: String,
        userId: String
    })
);

export default Scan;
