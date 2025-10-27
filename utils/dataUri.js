/**
 * Convert buffer to data URI for Cloudinary upload
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} mimetype - File mimetype
 * @returns {string} - Data URI string
 */
const bufferToDataURI = (buffer, mimetype) => {
  const base64 = buffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
};

module.exports = {
  bufferToDataURI,
};

