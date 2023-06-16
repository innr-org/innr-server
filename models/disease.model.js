import mongoose from "mongoose";

const Disease = mongoose.model(
    "Disease",
    new mongoose.Schema({
            name: String,
            description: String,
            causes: [],
            procedures: []
    })
);

export default Disease;
