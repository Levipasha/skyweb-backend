const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path or base64 string
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadImage = async (filePath, folder = 'skyweb') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

/**
 * Update image in Cloudinary (delete old and upload new)
 * @param {string} oldPublicId - Old Cloudinary public ID
 * @param {string} newFilePath - New file path or base64 string
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - New image data
 */
const updateImage = async (oldPublicId, newFilePath, folder = 'skyweb') => {
  try {
    // Delete old image
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }
    
    // Upload new image
    const newImage = await uploadImage(newFilePath, folder);
    return newImage;
  } catch (error) {
    console.error('Cloudinary update error:', error);
    throw new Error('Failed to update image in Cloudinary');
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  updateImage,
};

