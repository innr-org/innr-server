import mongoose from "mongoose";

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        fullName: String,
        phone: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ],
        scans: [],
        enrolls: []
    })
);
export default User;
