import db from '../models/index.js'
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicatePhone = async (req, res, next) => {
    try {
        // Phone
        const user = await User.findOne({ phone: req.body.phone });
        if (user) {
            return res.status(400).send({ message: "Failed! Phone is already in use!" });
        }

        next();
    } catch (err) {
        res.status(500).send({ message: err });
    }
};


const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                });
            }
        }
    }

    next();
};


const verifySignUp = {
    checkDuplicatePhone,
    checkRolesExisted
};

export default verifySignUp
