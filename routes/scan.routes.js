import {createScan, getScanById} from "../controllers/scan.controller.js";
import authJwt from "../middlewares/authJwt.js";

export default function specialistRoutes(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/scan/create", [authJwt.verifyToken], createScan);

    app.get("/api/scan/:id", [authJwt.verifyToken], getScanById);

};
