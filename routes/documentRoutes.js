import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
    uploadDocument,
    getClientDocuments,
    updateDocument,
    deleteDocument
} from '../controllers/documentController.js';

const router = express.Router();

router.post('/upload', protect, authorizeRoles('client'), upload.single('document'), uploadDocument);
router.get('/my', protect, authorizeRoles('client'), getClientDocuments);
router.put('/:id', protect, authorizeRoles('client'), updateDocument);
router.delete('/:id', protect, authorizeRoles('client'), deleteDocument);

export default router;
