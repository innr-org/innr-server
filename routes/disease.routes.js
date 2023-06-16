import {createDisease, getAllDiseases, getDiseaseById, getDiseasesByName} from "../controllers/disease.controller.js";
import authJwt from "../middlewares/authJwt.js";

export default function diseaseRoutes(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.post("/api/disease/create", [authJwt.verifyToken, authJwt.isModerator], createDisease);

    app.get("/api/disease/:id", [authJwt.verifyToken], getDiseaseById);

    app.get('/api/disease/getByName/:name', [authJwt.verifyToken], getDiseasesByName);

    app.get("/api/disease", [authJwt.verifyToken, authJwt.isModerator], getAllDiseases);


};
