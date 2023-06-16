import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

import userModel from './user.model.js';
import roleModel from './role.model.js';
import scanModel from './scan.model.js';
import diseaseModel from './disease.model.js';
import specialistModel from './specialist.model.js';
import refreshTokenModel from "./refreshToken.model.js";

db.user = userModel;
db.role = roleModel;
db.scan = scanModel;
db.disease = diseaseModel;
db.specialist = specialistModel;
db.refreshToken = refreshTokenModel;

db.ROLES = ["user", "admin", "moderator", "specialist"];

export default db;
