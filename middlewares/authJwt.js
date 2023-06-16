import jwt from 'jsonwebtoken'
import config from '../config/auth.config.js'
import db from '../models/index.js'
import Specialist from "../models/specialist.model.js";
const User = db.user;
const Role = db.role;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }

    return res.sendStatus(401).send({ message: "Unauthorized!" });
}

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return catchError(err, res);
        }
        req.userId = decoded.id;
        req.specialistId = decoded.id;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();
        if (!user) {
            return res.status(500).send({ message: "User not found." });
        }

        const roles = await Role.find({ _id: { $in: user.roles } }).exec();
        if (!roles) {
            return res.status(500).send({ message: "Roles not found." });
        }

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                return next();
            }
        }

        res.status(403).send({ message: "Require Admin Role!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const isModerator = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();
        if (!user) {
            return res.status(500).send({ message: "User not found." });
        }

        const roles = await Role.find({ _id: { $in: user.roles } }).exec();
        if (!roles) {
            return res.status(500).send({ message: "Roles not found." });
        }

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const isSpecialist = async (req, res, next) => {
    try {
        const specialist = await Specialist.findById(req.specialistId).exec();
        if (!specialist) {
            return res.status(500).send({ message: "Specialist not found." });
        }

        const roles = await Role.find({ _id: { $in: specialist.roles } }).exec();
        if (!roles) {
            return res.status(500).send({ message: "Roles not found." });
        }

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "specialist") {
                return next();
            }
        }

        res.status(403).send({ message: "Require Specialist Role!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isSpecialist
};

export default authJwt
