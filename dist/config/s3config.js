import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Load all configuration from environment variables
const PAYMENT_SLIP_BASE_URL = process.env.AWS_S3_PAYMENT_SLIP_BASE_URL;
const DEFAULT_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const PAYMENT_SLIP_FOLDER = process.env.AWS_S3_PAYMENT_SLIP_FOLDER;
const EXPENSE_SLIP_FOLDER = process.env.AWS_S3_EXPENSE_SLIP_FOLDER;
const AWS_REGION = process.env.AWS_REGION_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const CLOUDFRONT_DOMAIN = '.cloudfront.net/';
const DEBUG = process.env.NODE_ENV !== 'production';

// Validate all required environment variables
const validateEnvVariables = () => {
  const requiredVars = {
    'AWS_S3_PAYMENT_SLIP_BASE_URL': PAYMENT_SLIP_BASE_URL,
    'AWS_S3_BUCKET_NAME': DEFAULT_BUCKET_NAME,
    'AWS_S3_PAYMENT_SLIP_FOLDER': PAYMENT_SLIP_FOLDER,
    'AWS_S3_EXPENSE_SLIP_FOLDER': EXPENSE_SLIP_FOLDER,
    'AWS_REGION_NAME': AWS_REGION,
    'AWS_ACCESS_KEY_ID': AWS_ACCESS_KEY_ID,
    'AWS_SECRET_ACCESS_KEY': AWS_SECRET_ACCESS_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Validate on startup
validateEnvVariables();

if (DEBUG) {
  console.log('[S3 Config]', {
    region: AWS_REGION,
    bucket: DEFAULT_BUCKET_NAME,
    paymentFolder: PAYMENT_SLIP_FOLDER,
    expenseFolder: EXPENSE_SLIP_FOLDER
  });
}

const s3config = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const safeFileName = (fileName = 'payment-slip') =>
  fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');

const extractS3Key = (cloudFrontUrl) => {
  const parts = cloudFrontUrl.split(CLOUDFRONT_DOMAIN);
  if (parts.length !== 2) {
    throw new Error(`Invalid CloudFront URL format: ${cloudFrontUrl}`);
  }
  return parts[1];
};


export const uploadPaymentSlipToS3 = async ({ fileBuffer, fileName, mimeType }) => {
  if (!fileBuffer) {
    throw new Error('Payment slip file buffer is required.');
  }

  try {
    const normalizedFileName = safeFileName(fileName);
    const objectKey = `${PAYMENT_SLIP_FOLDER}/${Date.now()}-${normalizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: DEFAULT_BUCKET_NAME,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType || 'application/octet-stream',
    });

    await s3config.send(command);

    const resultUrl = `${PAYMENT_SLIP_BASE_URL.replace(/\/$/, '')}/${objectKey}`;
    if (DEBUG) console.log('[S3 Upload Success]', { url: resultUrl });

    return {
      bucket: DEFAULT_BUCKET_NAME,
      key: objectKey,
      url: resultUrl,
    };
  } catch (error) {
    console.error('[S3 Upload Error]', {
      message: error.message,
      code: error.code,
    });
    throw new Error(`Failed to upload payment slip to S3: ${error.message}`);
  }
};

export const uploadExpenseSlipToS3 = async ({ fileBuffer, fileName, mimeType }) => {
  if (!fileBuffer) {
    throw new Error('Expense slip file buffer is required.');
  }

  try {
    const normalizedFileName = safeFileName(fileName);
    const objectKey = `${EXPENSE_SLIP_FOLDER}/${Date.now()}-${normalizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: DEFAULT_BUCKET_NAME,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType || 'application/octet-stream',
    });

    await s3config.send(command);

    const resultUrl = `${PAYMENT_SLIP_BASE_URL.replace(/\/$/, '')}/${objectKey}`;
    if (DEBUG) console.log('[S3 Upload Success]', { url: resultUrl });

    return {
      bucket: DEFAULT_BUCKET_NAME,
      key: objectKey,
      url: resultUrl,
    };
  } catch (error) {
    console.error('[S3 Upload Error]', {
      message: error.message,
      code: error.code,
    });
    throw new Error(`Failed to upload expense slip to S3: ${error.message}`);
  }
};


export const deletePaymentSlipFromS3 = async (slipUrl) => {
  if (!slipUrl) {
    return { success: true, message: 'No file URL to delete' };
  }

  try {
    const objectKey = extractS3Key(slipUrl);

    const command = new DeleteObjectCommand({
      Bucket: DEFAULT_BUCKET_NAME,
      Key: objectKey,
    });

    await s3config.send(command);

    if (DEBUG) console.log('[S3 Delete Success]', { key: objectKey });

    return {
      success: true,
      message: 'File deleted successfully',
      deletedKey: objectKey,
    };
  } catch (error) {
    console.error('[S3 Delete Error]', { message: error.message });
    throw new Error(`Failed to delete payment slip from S3: ${error.message}`);
  }
};

export default s3config;
