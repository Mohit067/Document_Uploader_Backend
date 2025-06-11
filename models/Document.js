import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    filePath: { type: String, required: true },
    fileName: { type: String, required: true },
    fileMimeType: { type: String, required: true },
    deadline: { type: Date },
    uploadedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', DocumentSchema);
export default Document;
