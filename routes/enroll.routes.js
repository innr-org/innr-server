import authJwt from "../middlewares/authJwt.js";
import {createEnroll, getEnrollById, updateEnroll} from "../controllers/enroll.controller.js";

export default function enrollRoutes(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.post("/api/enroll/create", [authJwt.verifyToken], createEnroll);

    app.get("/api/enroll/:id", [authJwt.verifyToken], getEnrollById)

    app.put("/api/enroll/update", [authJwt.verifyToken], updateEnroll)

};
