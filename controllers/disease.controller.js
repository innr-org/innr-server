import Disease from '../models/disease.model.js';

export const createDisease = async (req, res) => {
    try {
        const { name, causes, procedures, description } = req.body;

        const disease = new Disease({
            name,
            description,
            causes,
            procedures,
        });

        await disease.save();

        res.status(201).json({ message: "Disease created successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllDiseases = async (req, res) => {
    try {
        const diseases = await Disease.find().exec();

        res.status(200).json({ diseases });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDiseaseById = async (req, res) => {
    try {
        const diseaseId = req.params.id;

        const disease = await Disease.findById(diseaseId);

        if (!disease) {
            return res.status(404).json({ message: "Disease not found." });
        }

        res.status(200).json(disease);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDiseasesByName = async (req, res) => {
    try {
        const diseaseName = req.params.name;

        const diseases = await Disease.find({ name: { $regex: new RegExp(diseaseName, "i") } }).exec();

        if (diseases.length === 0) {
            return res.status(404).json({ message: "Disease not found." });
        }

        res.status(200).json({ diseases });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



