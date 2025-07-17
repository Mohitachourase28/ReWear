import express from 'express';
// import upload from '../utils/upload.js';
import { createItem, getItemById, getAllItems } from '../controllers/itemController.js';

const router = express.Router();

router.post('/', createItem);
router.get('/:id', getItemById);
router.get('/', getAllItems); 

export default router;
