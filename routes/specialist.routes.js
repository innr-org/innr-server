import {
    addSpecialist,
    getAllSpecialists,
    getSpecialistById,
    getSpecialistByIdModerator
} from "../controllers/specialist.controller.js";
import authJwt from "../middlewares/authJwt.js";
import {authenticateTokenSpecialist, signinSpecialist} from "../controllers/auth.controller.js";

export default function specialistRoutes(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.post("/api/specialist/add", [authJwt.verifyToken, authJwt.isModerator], addSpecialist);

    app.get("/api/specialist/:id", [authJwt.verifyToken], getSpecialistById);

    app.get("/api/specialist/moderator/:id", [authJwt.verifyToken, authJwt.isModerator], getSpecialistByIdModerator);

    app.get("/api/specialist", [authJwt.verifyToken], getAllSpecialists);

    app.post("/api/specialist/signin", signinSpecialist);

    app.post("/api/specialist/profile", [authJwt.verifyToken, authJwt.isSpecialist], authenticateTokenSpecialist);

};
