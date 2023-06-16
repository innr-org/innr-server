import Scan from '../models/scan.model.js';
import axios from 'axios'

export const createScan = async (req, res) => {
    try {
        const token = req.headers["x-access-token"];

        // Getting user
        const user = await axios.get("http://localhost:8000/api/auth/profile", {
            headers: {
                'x-access-token': token
            }
        })
        const userId = user.data.id
        const userScans = user.data.scans
        console.log("userId: " + userId)

        // Send the request to the external endpoint - ml scanning
        const requestBody = {
            images: req.body.images
        };
        const responseMl = await axios.post('http://164.92.164.196:5000/predict', requestBody);
        const { acne_label, image_path } = JSON.parse((responseMl.data.replace(/b'/g, "'")).replace(/'/g, '"'));
        console.log(acne_label)

        // Send the request to the local endpoint - getting diseases
        const responseAcne = await axios.get('http://localhost:8000/api/disease/getByName/Acne', {
            headers: {
                'x-access-token': token
            },
        });

        // Send the request to the local endpoint - getting specialists
        const responseSpecialists = await axios.get("http://localhost:8000/api/specialist/64871361b1c5ea2f35f262b7", {
            headers: {
                'x-access-token': token
            }
        })

        //creating new scan
        const scan = new Scan({
            percent: acne_label,
            image: image_path,
            diseases: acne_label*100<50 ? [responseAcne.data.diseases[0]._id] : [],
            specialists: acne_label*100<50 ? [responseSpecialists.data._id] : [],
            userId
        });
        const savedScan = await scan.save();

        // Update the user's scans array with the new scan ID
        const responseUser = await axios.put(
            `http://localhost:8000/api/users/${userId}`,
            { scans: [...userScans, savedScan._id] },
            {
                headers: {
                    'x-access-token': token,
                },
            }
        );


        res.send({scanId: savedScan._id});
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

export const getScanById = async (req, res) => {
    try {
        const scanId = req.params.id;

        const scan = await Scan.findById(scanId);

        if (!scan) {
            return res.status(404).json({ message: "Scan not found" });
        }

        res.status(200).json(scan);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

