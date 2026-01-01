import express from 'express';
import {
  getData,
  getStats,
  getFilters,
  getGroupedData,
} from '../controllers/dataController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getData);
router.get('/stats', getStats);
router.get('/filters', getFilters);
router.get('/grouped', getGroupedData);

export default router;


