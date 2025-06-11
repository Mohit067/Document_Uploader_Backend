import Document from '../models/Document.js';
import User from '../models/User.js';

// @desc    Get all documents (Admin)
// @route   GET /api/admin/documents
// @access  Private (Admin)
const getAllDocuments = async (req, res) => {
    try {
        const { deadline, clientName, documentType } = req.query;
        let query = {};

        if (deadline) {
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            query.deadline = { $lte: sevenDaysFromNow };
        }

        if (documentType) {
            query.type = new RegExp(documentType, 'i');
        }

        if (clientName) {
            const users = await User.find({ username: new RegExp(clientName, 'i') }).select('_id');
            const userIds = users.map(user => user._id);
            query.userId = { $in: userIds };
        }

        const documents = await Document.find(query).populate('userId', 'username email');
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all clients (Admin)
// @route   GET /api/admin/clients
// @access  Private (Admin)
const getAllClients = async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' }).select('-password');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllDocuments, getAllClients };
