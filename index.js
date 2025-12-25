const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// TELEGRAM
// ===============================
const TELEGRAM_TOKEN = "8355405180:AAGPNebGTEQDaeZGRiQgh41VM1wCShMVRGE";
const CHAT_ID = "7577766836";

// ===============================
// STORAGE UPLOAD
// ===============================
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ===============================
// TEST
// ===============================
app.get("/test", (req, res) => {
  res.send("Backend OK");
});

// ===============================
// UPLOAD PROJECT
// ===============================
app.post("/deploy", upload.single("project"), async (req, res) => {
  const { siteName } = req.body;
  const file = req.file;

  if (!siteName || !file) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  const msg = `
🚀 HALO OWNER ADA DEPLOY BARU MASUK
━━━━━━━━━━━━━━
📛 Nama Website: ${siteName}
📦 File: ${file.originalname}
📁 Disimpan: ${file.filename}
⏰ Waktu: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━
`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: msg
      }
    );

    res.json({ success: true, message: "Upload berhasil, admin diberitahu" });
  } catch (err) {
    res.status(500).json({ error: "Telegram gagal" });
  }
});

// ===============================
// RUN SERVER
// ===============================
app.listen(3000, () => {
  console.log("Backend upload jalan di http://localhost:3000");
});