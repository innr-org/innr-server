import config from '../config/auth.config.js'
import db from '../models/index.js'
const User = db.user;
const Role = db.role;

import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import RefreshToken from "../models/refreshToken.model.js";
import Specialist from "../models/specialist.model.js";

export const signup = async (req, res) => {
    try {
        const user = new User({
            fullName: req.body.fullName,
            phone: req.body.phone,
            password: bcrypt.hashSync(req.body.password, 8)
        });

        await user.save();

        if (req.body.roles) {
            const roles = await Role.find({ name: { $in: req.body.roles } });
            user.roles = roles.map(role => role._id);
            await user.save();
        } else {
            const role = await Role.findOne({ name: "user" });
            user.roles = [role._id];
            await user.save();
        }

        res.send({ message: "User was registered successfully!" });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

export const signin = async (req, res) => {
    try {
        const user = await User.findOne({
            phone: req.body.phone,
        }).populate("roles", "-__v");

        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid Password!",
            });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        const refreshToken = await RefreshToken.createToken(user);

        const authorities = user.roles.map(
            (role) => "ROLE_" + role.name.toUpperCase()
        );

        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            phone: user.phone,
            enrolls: user.enrolls,
            scans: user.scans,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

export const signinSpecialist = async (req, res) => {
    try {
        const specialist = await Specialist.findOne({
            email: req.body.email,
        }).populate("roles", "-__v");

        if (!specialist) {
            return res.status(404).json({ message: "Specialist Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            specialist.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid Password!",
            });
        }

        const token = jwt.sign({ id: specialist.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        const refreshToken = await RefreshToken.createToken(specialist);

        const specialistData = {
            _id: specialist._id,
            fullName: specialist.fullName,
            phone: specialist.phone,
            email: specialist.email,
            rating: specialist.rating,
            gender: specialist.gender,
            experience: specialist.experience,
            dateOfBirth: specialist.dateOfBirth,
            city: specialist.city,
            status: specialist.status,
            price: specialist.price,
            image: specialist.image,
        }

        res.status(200).json({
            specialist: specialistData,
            accessToken: token,
            refreshToken: refreshToken,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};



export const authenticateTokenSpecialist = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    jwt.verify(token, config.secret, (err, specialist) => {
        if (err) {
            return res.status(403).json({ message: "Invalid access token" });
        }

        Specialist.findById(specialist.id)
            .populate("roles", "-__v") // Populate the 'roles' field
            .exec()
            .then(async (specialist) => {
                if (!specialist) {
                    return res.status(404).json({message: "Specialist not found"});
                }

                const token = jwt.sign({ id: specialist.id }, config.secret, {
                    expiresIn: config.jwtExpiration,
                });

                const refreshToken = await RefreshToken.createToken(specialist);

                const specialistData = {
                    _id: specialist._id,
                    fullName: specialist.fullName,
                    phone: specialist.phone,
                    email: specialist.email,
                    rating: specialist.rating,
                    gender: specialist.gender,
                    experience: specialist.experience,
                    dateOfBirth: specialist.dateOfBirth,
                    city: specialist.city,
                    status: specialist.status,
                    price: specialist.price,
                    image: specialist.image,
                }

                res.status(200).json({
                    specialist: specialistData,
                    accessToken: token,
                    refreshToken: refreshToken,
                });
            })
            .catch((err) => {
                return res.status(500).json({ message: err });
            });
    });
};


export const authenticateToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    jwt.verify(token, config.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid access token" });
        }

        User.findById(user.id)
            .populate("roles", "-__v") // Populate the 'roles' field
            .exec()
            .then(async (user) => {
                if (!user) {
                    return res.status(404).json({message: "User not found"});
                }

                const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

                const refreshToken = await RefreshToken.createToken(user);

                const response = {
                    id: user._id,
                    fullName: user.fullName,
                    phone: user.phone,
                    enrolls: user.enrolls,
                    scans: user.scans,
                    roles: authorities,
                    accessToken: token,
                    refreshToken: refreshToken,
                };

                res.status(200).json(response);
            })
            .catch((err) => {
                return res.status(500).json({ message: err });
            });
    });
};




export const refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        const refreshToken = await RefreshToken.findOne({ token: requestToken });

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            await RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false });

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }

        const newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};
