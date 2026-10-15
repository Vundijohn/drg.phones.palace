const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');
const { requireAdminAuth } = require('../middleware/auth');
const firebase = require('../firebase');
const config = require('../config');

// Helper to remove temporary files if uploaded to cloud
async function removeTempFiles(files) {
  const results = await Promise.allSettled(files.map(file => fs.promises.unlink(file.path)));
  results.forEach((result, index) => {
    if (result.status === 'rejected' && (!result.reason || result.reason.code !== 'ENOENT')) {
      console.warn(`[Image Upload] Could not remove temp file ${files[index].filename}: ${result.reason ? result.reason.message : 'Filesystem error'}`);
    }
  });
}

// Public: GET /api/upload/status
router.get('/status', async (req, res) => {
  const storageActive = await firebase.testStorageAccess().catch(() => false);
  const bucketName = config.firebaseConfig.storageBucket || `${config.firebaseConfig.projectId}.firebasestorage.app`;
  res.json({
    success: true,
    storage: storageActive ? 'firebase' : 'local',
    isCloudStorage: storageActive,
    bucket: storageActive ? bucketName : null,
    message: storageActive
      ? `Firebase Cloud Storage active (${bucketName})`
      : 'Local server filesystem active (Images persist on server and in database)'
  });
});

// Protected: POST /api/upload (Multipart image upload)
router.post('/', requireAdminAuth, (req, res) => {
  upload.array('image', 12)(req, res, async (err) => {
    const uploadedFiles = req.files || [];
    if (err) {
      await removeTempFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Form field must be named "image".'
      });
    }

    // Check if Firebase Storage is available
    const adminStorage = firebase.adminStorage;
    const isCloudReady = Boolean(adminStorage);

    if (isCloudReady) {
      let bucket;
      const storedObjects = [];
      try {
        const bucketName = config.firebaseConfig.storageBucket || `${config.firebaseConfig.projectId}.firebasestorage.app`;
        bucket = adminStorage.bucket(bucketName);
        const fileUrls = [];

        for (const file of uploadedFiles) {
          const destination = `phones/${file.filename}`;
          const token = crypto.randomUUID();
          await bucket.upload(file.path, {
            destination,
            metadata: {
              contentType: file.mimetype,
              metadata: { firebaseStorageDownloadTokens: token }
            }
          });
          storedObjects.push(destination);
          fileUrls.push(
            `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media&token=${token}`
          );
        }

        // Clean up temporary local files after successful cloud upload
        await removeTempFiles(uploadedFiles);

        return res.json({
          success: true,
          storage: 'firebase',
          isCloudStorage: true,
          message: 'Image uploaded successfully to Firebase Cloud Storage',
          url: fileUrls[0],
          urls: fileUrls,
          filenames: uploadedFiles.map(file => file.filename),
          size: uploadedFiles.reduce((total, file) => total + file.size, 0)
        });
      } catch (storageErr) {
        console.warn(`[Firebase Storage] Bucket upload encountered error: ${storageErr.message}. Falling back to local & database storage.`);
      }
    }

    // Resilient Fallback: Serve via express /uploads/ AND generate lightweight data URLs
    try {
      const fileUrls = uploadedFiles.map(file => `uploads/${file.filename}`);
      const dataUrls = [];

      for (const file of uploadedFiles) {
        try {
          const buf = await fs.promises.readFile(file.path);
          const base64 = buf.toString('base64');
          dataUrls.push(`data:${file.mimetype || 'image/jpeg'};base64,${base64}`);
        } catch (e) {
          dataUrls.push(null);
        }
      }

      res.json({
        success: true,
        storage: 'local',
        isLocal: true,
        isCloudStorage: false,
        message: 'Image uploaded and saved to server storage',
        url: fileUrls[0],
        urls: fileUrls,
        dataUrl: dataUrls[0],
        dataUrls: dataUrls.filter(Boolean),
        filenames: uploadedFiles.map(file => file.filename),
        size: uploadedFiles.reduce((total, file) => total + file.size, 0)
      });
    } catch (localErr) {
      await removeTempFiles(uploadedFiles);
      res.status(500).json({
        success: false,
        message: `Image saving failed: ${localErr.message}`
      });
    }
  });
});

// Protected: POST /api/upload/base64 (Direct Data URL / Base64 upload)
router.post('/base64', requireAdminAuth, async (req, res) => {
  try {
    const { imageBase64, filename, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'imageBase64 is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const safeName = (filename || `device-${Date.now()}-${Math.round(Math.random() * 1e4)}`).replace(/[^a-z0-9._-]/gi, '-');
    const finalFilename = safeName.endsWith('.jpg') || safeName.endsWith('.png') || safeName.endsWith('.webp')
      ? safeName
      : `${safeName}.jpg`;

    const adminStorage = firebase.adminStorage;
    if (adminStorage) {
      try {
        const bucketName = config.firebaseConfig.storageBucket || `${config.firebaseConfig.projectId}.firebasestorage.app`;
        const bucket = adminStorage.bucket(bucketName);
        const destination = `phones/${finalFilename}`;
        const token = crypto.randomUUID();
        const file = bucket.file(destination);
        await file.save(buffer, {
          metadata: {
            contentType: mimeType,
            metadata: { firebaseStorageDownloadTokens: token }
          }
        });
        const cloudUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media&token=${token}`;
        return res.json({
          success: true,
          storage: 'firebase',
          isCloudStorage: true,
          url: cloudUrl,
          urls: [cloudUrl],
          filename: finalFilename
        });
      } catch (err) {
        console.warn(`[Firebase Storage] Base64 upload failed: ${err.message}. Saving to local.`);
      }
    }

    // Save to uploads folder
    const targetPath = path.join(config.UPLOADS_DIR, finalFilename);
    await fs.promises.writeFile(targetPath, buffer);
    const localUrl = `uploads/${finalFilename}`;

    res.json({
      success: true,
      storage: 'local',
      isLocal: true,
      url: localUrl,
      urls: [localUrl],
      dataUrl: imageBase64,
      filename: finalFilename
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
