import dotenv from 'dotenv'
import express from 'express';
import mongoose from "mongoose";
import cors from 'cors'
import db from './models/index.js';

dotenv.config()
const app = express()
const port = process.env.PORT || 9000
const connection_url = process.env.DBURL


//middlewares
app.use(cors())
app.use(express.json({ limit: '10mb' })); // Set the payload size limit as needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//DB config
//Models (Roles)
const Role = db.role
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to MongoDB");
        initial();
    })
    .catch(err => {
    console.error("Connection error", err);
    process.exit();
});


//Functions
async function initial() {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await Promise.all([
                new Role({ name: "user" }).save(),
                new Role({ name: "moderator" }).save(),
                new Role({ name: "admin" }).save(),
                new Role({ name: "specialist" }).save()
            ]);
            console.log("Added roles to the collection.");
        }
    } catch (err) {
        console.log("Error initializing roles:", err);
    }
}

//Enpoints
app.get('/', (req, res) =>  res.json({ message: "Welcome to innr server." }))

// routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import diseaseRoutes from "./routes/disease.routes.js";
import specialistRoutes from "./routes/specialist.routes.js";
import scanRoutes from './routes/scan.routes.js'
import enrollRoutes from './routes/enroll.routes.js'
authRoutes(app);
userRoutes(app);
diseaseRoutes(app)
specialistRoutes(app)
scanRoutes(app)
enrollRoutes(app)

//listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))


