import User from '../models/user.model.js';
import jwt from "jsonwebtoken";
import config from '../config/auth.config.js'
import Scan from "../models/disease.model.js";

export const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

export const userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

export const adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

export const moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        res.status(200).send({ message: "User updated successfully.", user });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const updateUserByAccessToken = async (req, res) => {
    const token = req.headers["x-access-token"];
    const updateData = req.body;

    try {
        // Find the user associated with the access token
        const user = await User.findOneAndUpdate(
            { accessToken: token },
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        res.status(200).send({ message: "User updated successfully.", user });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const getScansByAccessToken = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];

        // Verify the access token
        jwt.verify(token, config.secret, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid access token' });
            }

            const userId = decoded._id;

            // Find scans associated with the user
            const scans = await Scan.find({ userId: userId });

            res.status(200).json({ scans });
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};
