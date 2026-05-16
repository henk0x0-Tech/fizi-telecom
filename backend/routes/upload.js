import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Store originals in memory, convert to WebP before saving to disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'));
  },
});

// ── POST /api/upload — upload & convert to WebP ──────────────────────────
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const baseName = path.parse(req.file.originalname).name
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const filename = `${baseName}-${uniqueSuffix}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Convert to WebP at quality 82, strip metadata
    await sharp(req.file.buffer)
      .webp({ quality: 82, effort: 4 })
      .toFile(filepath);

    const stat = fs.statSync(filepath);
    res.json({
      imageUrl: `/uploads/${filename}`,
      filename,
      size: stat.size,
      message: 'Uploaded and converted to WebP',
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/upload/list — list all uploaded images ───────────────────────
router.get('/list', authMiddleware, (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir)
      .filter(f => /\.(webp|jpg|jpeg|png|gif)$/i.test(f))
      .map(f => {
        const stat = fs.statSync(path.join(uploadDir, f));
        return {
          filename: f,
          url: `/uploads/${f}`,
          size: stat.size,
          modified: stat.mtime,
        };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/upload/:filename — delete a specific image ───────────────
router.delete('/:filename', authMiddleware, (req, res) => {
  try {
    const filename = path.basename(req.params.filename); // prevent path traversal
    const filepath = path.join(uploadDir, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    fs.unlinkSync(filepath);
    res.json({ success: true, message: `${filename} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
