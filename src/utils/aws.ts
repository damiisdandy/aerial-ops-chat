import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

/**
 * 
 * @param fileName unique identifier for file 
 * @returns S3 signed URL
 */
export const getSignedURL = async (fileName: string) => {
  const bucketParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
  }
  const uploadURL = await s3.getSignedUrlPromise("putObject", bucketParams);
  return uploadURL;
}

/**
 * 
 * @param fileName id of file you want to delete
 */
export const deleteImage = (fileName: string) => {
  const deleteParam = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
  }
  s3.deleteObject(deleteParam, (err, data) => {
    if (err) throw err;
  })
}