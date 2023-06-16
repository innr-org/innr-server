import verifySignUp from "../middlewares/verifySignUp.js";
import {signup, signin, refreshToken, authenticateToken} from '../controllers/auth.controller.js'

export default function authRoutes(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicatePhone,
            verifySignUp.checkRolesExisted
        ],
        signup
    );

    app.post("/api/auth/signin", signin);

    app.post("/api/auth/refreshtoken", refreshToken);

    app.get("/api/auth/profile", authenticateToken);
};
