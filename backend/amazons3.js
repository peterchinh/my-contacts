import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// const generateS3Url = (req, res) => {
//     const { filename, filetype } = req.body;

//     const s3Params = {
//         Bucket: '308-mycontacts1',
//         Key: filename,
//         Expires: 60,
//         ContentType: filetype,
//         ACL: 'public-read',
//     };

//     s3.getSignedUrl('putObject', s3Params, (err, signedUrl) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error generating signed URL' });
//         }
//         res.json({ signedUrl });
//     });
// }

export default s3;