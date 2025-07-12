import multer from 'multer';
import cloudinaryUtils from './cloudinary.js';
const { storage } = cloudinaryUtils;
const upload = multer({ storage });

export default upload;
