import authJwt from "../middlewares/authJwt.js";
import {
    allAccess,
    userBoard,
    moderatorBoard,
    adminBoard,
    updateUser,
    updateUserByAccessToken, getScansByAccessToken
} from '../controllers/user.controller.js'

export default function userRoutes(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", allAccess);

    app.get("/api/test/user", [authJwt.verifyToken], userBoard);

    app.get(
        "/api/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        moderatorBoard
    );

    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        adminBoard
    );

    // app.put("/api/users", [authJwt.verifyToken], updateUserByAccessToken);

    app.put("/api/users/:id", [authJwt.verifyToken], updateUser);

    app.get("/api/users/scans", [authJwt.verifyToken], getScansByAccessToken);

};
