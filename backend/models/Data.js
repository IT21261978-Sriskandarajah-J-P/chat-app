import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Data = mongoose.model('Data', DataSchema);

export default Data;
