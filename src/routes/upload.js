const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const upload = require('../middleware/upload');
const { requireAdminAuth } = require('../middleware/auth');
const { adminApp, adminStorage } = require('../firebase');

async function removeTempFiles(files) {
  const results = await Promise.allSettled(files.map(file => fs.promises.unlink(file.path)));
  results.forEach((result, index) => {
    if (result.status === 'rejected' && (!result.reason || result.reason.code !== 'ENOENT')) {
      console.warn(`[Image Upload] Could not remove temporary file ${files[index].filename}: ${result.reason ? result.reason.message : 'Unknown filesystem error'}`);
    }
  });
}

// Protected: POST /api/upload
router.post('/', requireAdminAuth, (req, res) => {
  if (!adminApp || !adminStorage) {
    return res.status(503).json({
      success: false,
      message: 'Persistent image storage is not configured. Configure Firebase Admin credentials and Storage before uploading.'
    });
  }

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

    let bucket;
    const storedObjects = [];
    try {
      bucket = adminStorage.bucket();
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
      await removeTempFiles(uploadedFiles);
      res.json({
        success: true,
        message: 'Image uploaded successfully',
        url: fileUrls[0],
        urls: fileUrls,
        filenames: uploadedFiles.map(file => file.filename),
        size: uploadedFiles.reduce((total, file) => total + file.size, 0)
      });
    } catch (storageErr) {
      const cleanupResults = await Promise.allSettled(
        bucket ? storedObjects.map(destination => bucket.file(destination).delete()) : []
      );
      cleanupResults.forEach((result, index) => {
        if (result.status === 'rejected' && result.reason) {
          console.warn(`[Firebase Storage] Could not remove incomplete upload ${storedObjects[index]}: ${result.reason.message}`);
        }
      });
      await removeTempFiles(uploadedFiles);
      console.error(`[Firebase Storage] Upload failed: ${storageErr.message}`);
      res.status(502).json({
        success: false,
        message: 'Image upload failed. Check Firebase Storage bucket configuration and service-account permissions.'
      });
    }
  });
});

module.exports = router;
