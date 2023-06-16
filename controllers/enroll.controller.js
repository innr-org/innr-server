import Enroll from '../models/enroll.model.js';
import axios from "axios";

export const createEnroll = async (req, res) => {
    try {
        const token = req.headers["x-access-token"];

        const user = await axios.get("http://localhost:8000/api/auth/profile", {
            headers: {
                'x-access-token': token
            }
        })
        const userId = user.data.id
        const userEnrolls = user.data.enrolls
        console.log(userEnrolls)

        const { startDate, endDate, specialistId, type, comments } = req.body;

        // Create a new Enroll instance
        const enroll = new Enroll({
            startDate,
            endDate,
            userId,
            specialistId,
            type,
            comments
        });

        // Save the Enroll record to the database
        const savedEnroll = await enroll.save();

        const responseUser = await axios.put(
            `http://localhost:8000/api/users/${userId}`,
            { enrolls: [...userEnrolls, savedEnroll._id] },
            {
                headers: {
                    'x-access-token': token,
                },
            }
        );

        res.status(201).json(savedEnroll);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err });
    }
};

export const getEnrollById = async (req, res) => {
    try {
        const enrollId = req.params.id;

        // Find the Enroll record by ID
        const enroll = await Enroll.findById(enrollId);

        if (!enroll) {
            return res.status(404).json({ message: 'Enroll not found' });
        }

        res.status(200).json(enroll);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

export const updateEnroll = async (req, res) => {
    try {
        const enrollId = req.params.id;
        const { startDate, endDate, userId, specialistId, type, comments } = req.body;

        // Find the Enroll record by ID
        const enroll = await Enroll.findById(enrollId);

        if (!enroll) {
            return res.status(404).json({ message: 'Enroll not found' });
        }

        // Update the Enroll record
        enroll.startDate = startDate;
        enroll.endDate = endDate;
        enroll.userId = userId;
        enroll.specialistId = specialistId;
        enroll.type = type;
        enroll.comments = comments;

        // Save the updated Enroll record
        const updatedEnroll = await enroll.save();

        res.status(200).json(updatedEnroll);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};
