import mongoose from "mongoose";

const Specialist = mongoose.model(
    "Specialist",
    new mongoose.Schema({
        fullName: String,
        phone: String,
        email: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ],
        rating: Number,
        gender: String,
        experience: Number,
        dateOfBirth: String,
        city: String,
        status: Boolean,
        price: Number,
        organization: String,
        speciality: String,
        tags: [],
        enrolls: [],
        timeslots: [],
        image: String,
    })
);
export default Specialist;
