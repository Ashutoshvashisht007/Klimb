import express from 'express';
import cors from 'cors';
import { readAndUploadFile } from './controller/candidateController.js';
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: multerStorage });

// MongoDB connection
mongoose.connect('mongodb://0.0.0.0:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "Klimb"
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.post("/api/upload", upload.single("file"), (req, res) => {
  readAndUploadFile(req,res);
  res.status(200);
  res.send();
});

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
