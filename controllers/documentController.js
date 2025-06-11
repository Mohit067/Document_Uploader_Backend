import Document from '../models/Document.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname in ES Module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload a new document
// @route   POST /api/documents/upload
// @access  Private (Client)
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { name, type, description, deadline } = req.body;

        const newDocument = new Document({
            userId: req.user._id,
            name,
            type,
            description,
            deadline: deadline ? new Date(deadline) : null,
            filePath: `/uploads/${req.file.filename}`,
            fileName: req.file.originalname,
            fileMimeType: req.file.mimetype
        });

        const createdDocument = await newDocument.save();
        res.status(201).json(createdDocument);
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ message: 'Server error during document upload' });
    }
};

// @desc    Get all documents for a client
// @route   GET /api/documents/my
// @access  Private (Client)
const getClientDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ userId: req.user._id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private (Client)
const updateDocument = async (req, res) => {
    const { name, type, description, deadline } = req.body;

    try {
        const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });

        if (!document) {
            return res.status(404).json({ message: 'Document not found or not authorized' });
        }

        document.name = name || document.name;
        document.type = type || document.type;
        document.description = description || document.description;
        document.deadline = deadline ? new Date(deadline) : document.deadline;

        const updatedDocument = await document.save();
        res.json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private (Client)
const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });

        if (!document) {
            return res.status(404).json({ message: 'Document not found or not authorized' });
        }

        // Delete the file from the server
        const filePath = path.join(__dirname, '..', document.filePath);
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        await Document.deleteOne({ _id: req.params.id });
        res.json({ message: 'Document removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    uploadDocument,
    getClientDocuments,
    updateDocument,
    deleteDocument
};
