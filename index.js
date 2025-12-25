
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');

const app = express();
app.use(cors());

// Folder public untuk frontend
app.use(express.static('public'));

// Setup multer untuk upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Token dan chat_id Telegram
const TELEGRAM_TOKEN = '8355405180:AAGPNebGTEQDaeZGRiQgh41VM1wCShMVRGE';
const CHAT_ID = '7577766836';

// Route upload file HTML
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Kirim file ke Telegram
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('document', fs.createReadStream(filePath));

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, formData, {
      headers: formData.getHeaders()
    });

    res.send('File berhasil diupload dan dikirim ke Telegram!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan.');
  }
});

// Jalankan server dengan port dari Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend jalan di port ${PORT}`);
});
