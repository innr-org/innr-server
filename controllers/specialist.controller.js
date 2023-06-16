import Specialist from '../models/specialist.model.js';
import Role from "../models/role.model.js";

export const addSpecialist = async (req, res) => {
    try {
        const { fullName, phone, email, password, rating, gender, experience, dateOfBirth, city, status, price, organization, speciality, tags, image } = req.body;

        const specialist = new Specialist({
            fullName,
            phone,
            email,
            password: bcrypt.hashSync(password, 8),
            rating,
            gender,
            experience,
            dateOfBirth,
            city,
            status,
            price,
            organization,
            speciality,
            tags,
            enrolls: [],
            timeslots: [],
            image,
        });

        const role = await Role.findOne({ name: "specialist" });
        specialist.roles = [role._id];

        await specialist.save();

        res.status(201).json({ message: "Specialist added successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

export const getSpecialistById = async (req, res) => {
    try {
        const specialistId = req.params.id;

        const specialist = await Specialist.findById(specialistId).select('-password');
        if (!specialist) {
            return res.status(404).json({ message: "Specialist not found." });
        }

        res.status(200).json(specialist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getSpecialistByIdModerator = async (req, res) => {
    try {
        const specialistId = req.params.id;

        const specialist = await Specialist.findById(specialistId)
        if (!specialist) {
            return res.status(404).json({ message: "Specialist not found." });
        }

        res.status(200).json(specialist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllSpecialists = async (req, res) => {
    try {
        const specialists = await Specialist.find().exec();

        res.status(200).json({ specialists });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


