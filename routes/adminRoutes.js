import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { getAllDocuments, getAllClients } from '../controllers/adminController.js';

const router = express.Router();

router.get('/documents', protect, authorizeRoles('admin'), getAllDocuments);
router.get('/clients', protect, authorizeRoles('admin'), getAllClients);

export default router;
