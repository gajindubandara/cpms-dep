
import cloudinary from 'cloudinary';
import { Readable } from 'node:stream';

// Initialize Cloudinary with environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper function to handle Cloudinary upload stream
 * @param {Buffer|Stream} fileBuffer - The file buffer/stream to upload
 * @param {Object} uploadOptions - Cloudinary upload options
 * @returns {Promise<Object>} - Upload response
 */
const uploadStreamToCloudinary = async (fileBuffer, uploadOptions) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      uploadOptions,
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
};

/**
 * Upload file to Cloudinary
 * @param {Buffer|Stream} fileBuffer - The file buffer/stream to upload
 * @param {string} fileName - Name for the uploaded file
 * @param {Object} options - Additional Cloudinary upload options
 * @returns {Promise<Object>} - Upload response with secure_url
 */
export const uploadToCloudinary = async (fileBuffer, fileName, options = {}) => {
  try {
    const result = await uploadStreamToCloudinary(fileBuffer, {
      resource_type: 'image', // Only accept image files
      public_id: `${fileName}`,
      folder: 'G2-Cpms/payment-slips',
      overwrite: true,
      ...options,
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload error: ${error.message}`);
  }
};

/**
 * Upload PDF file to Cloudinary
 * @param {Buffer|Stream} fileBuffer - The PDF file buffer/stream to upload
 * @param {string} fileName - Name for the uploaded file (without extension)
 * @param {string} folder - Folder path within G2-CPMS (e.g., 'quotations')
 * @param {Object} options - Additional Cloudinary upload options
 * @returns {Promise<Object>} - Upload response with secure_url and public_id
 */
export const uploadPDFToCloudinary = async (fileBuffer, fileName, folder = 'documents', options = {}) => {
  try {
    const fullFolderPath = `G2-Cpms/${folder}`;
    const fileNameWithoutExt = fileName.replace(/\.pdf$/i, '');
    
    const result = await uploadStreamToCloudinary(fileBuffer, {
      resource_type: 'raw', 
      public_id: fileNameWithoutExt,
      folder: fullFolderPath,
      format: 'pdf',
      overwrite: true,
      ...options,
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary PDF upload error: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
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
  // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.ext
  const regex = /\/v\d+\/(.*)\.\w+$/;
  const match = regex.exec(secureUrl);
  return match ? match[1] : null;
};

export {default as cloudinary} from 'cloudinary';
