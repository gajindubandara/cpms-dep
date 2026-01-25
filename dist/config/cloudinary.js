import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Initialize Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {Buffer|Stream} fileBuffer - The file buffer/stream to upload
 * @param {string} fileName - Name for the uploaded file
 * @param {Object} options - Additional Cloudinary upload options
 * @returns {Promise<Object>} - Upload response with secure_url
 */
export const uploadToCloudinary = async (fileBuffer, fileName, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Auto-detect file type (image, pdf, etc)
          public_id: `${fileName}`,
          folder: 'G2-Cpms/payment-slips',
          overwrite: true,
          ...options,
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else {
            resolve(result);
          }
        }
      );

      // Convert buffer to stream and pipe to upload stream
      if (Buffer.isBuffer(fileBuffer)) {
        Readable.from(fileBuffer).pipe(uploadStream);
      } else {
        fileBuffer.pipe(uploadStream);
      }
    });
  } catch (error) {
    throw new Error(`Cloudinary upload error: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
  }
};

/**
 * Extract public ID from Cloudinary secure URL
 * @param {string} secureUrl - Full Cloudinary secure URL
 * @returns {string} - Public ID
 */
export const extractPublicIdFromUrl = (secureUrl) => {
  try {
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.ext
    const match = secureUrl.match(/\/v\d+\/(.*)\.\w+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

export default cloudinary;
