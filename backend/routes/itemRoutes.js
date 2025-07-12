import express from 'express';
import upload from '../utils/upload.js';
import { createItem, getItemById } from '../controllers/itemController.js';

const router = express.Router();

router.post('/', upload.array('images', 5), createItem);
router.get('/:id', getItemById);

export default router;
