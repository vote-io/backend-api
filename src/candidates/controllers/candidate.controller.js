const { v4: uuidv4 } = require('uuid');
const serviceAccount = require('../../../firebaseAuth.json');
const fs = require("fs");
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

// multer to recieve images
const multer = require('multer');
const upload = multer();

const firebaseAdmin = require('firebase-admin');
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});
const storageRef = admin.storage().bucket(`gs://fishing-backend.appspot.com`);

// A function that takes care of uploading the image to my firebase storage
async function uploadImage(path, filename) {
    const storage = await storageRef.upload(path, {
        public: true,
        destination: `${filename}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });
    return storage[0].metadata.mediaLink;
}

exports.profilePic = async (req, res) => {
    try {
        const tempImageName = uuidv4();
        const tempImage = `${tempImageName}.${req.file.mimetype.split('/')[1]}`
        fs.writeFileSync(appDir + `/public/images/${tempImage}`, req.file.buffer);
        const uploadLink = await uploadImage(appDir + `/public/images/${tempImage}`, `candidatePics/${tempImage}`);

        // deleting the image
        fs.stat(appDir + `/public/images/${tempImage}`, function (err, stats) {
            if (err) {
                res.status(400).json({ message: "server error while checking for image validity" });
            }

            // deleting the file
            fs.unlink(appDir + `/public/images/${tempImage}`, function (err) {
                if (err) res.status(400).json({ message: "server error while deleting the image" });
                console.log('file deleted successfully');
            });
        });
        const sendData = {
            "link": uploadLink
        }

        res.status(200).json(sendData);
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "server error" });
    }

}