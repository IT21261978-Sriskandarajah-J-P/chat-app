import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import CryptoJS from "crypto-js";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import data from './models/Data.js';

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

// Encryption function
function encrypt(data, key) {
    return CryptoJS.AES.encrypt(data, key).toString();
}

// Decryption function
function decrypt(cipherText, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        if (bytes.sigBytes > 0) {
            return bytes.toString(CryptoJS.enc.Utf8);
        } else {
            throw new Error('Decryption Failed: Invalid Key');
        }
    } catch (error) {
        throw new Error('Decryption Failed: Invalid Key');
    }
}


app.post('/api/saveData', async (req, res) => {
    const { data, key } = req.body;
    const encryptedData = encrypt(data, key);
    
    try {
        const newData = new Data({ content: encryptedData });
        await newData.save();
        res.json({ message: 'Data saved successfully', encryptedData });
    } catch (error) {
        res.status(500).json({ error: 'Error saving data' });
    }
});

app.post('/api/getData', async (req, res) => {
    const { id, key } = req.body;
    
    try {
        const dataEntry = await Data.findById(id);
        if (!dataEntry) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const decryptedData = decrypt(dataEntry.content, key);
        res.json({ decryptedData });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving or decrypting data' });
    }
});


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});
