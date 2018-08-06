/**
 * Helper methods to deal with image processing on the backend
 */

const sharp = require('sharp');
const AWS = require('aws-sdk');
const uuid = require('uuid-v4');

// Isolate environmental variables
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_USER_KEY = process.env.AWS_USER_KEY;
const AWS_USER_SECRET = process.env.AWS_USER_SECRET;

// Set up bucket
const s3bucket = new AWS.S3({
  accessKeyId: AWS_USER_KEY,
  secretAccessKey: AWS_USER_SECRET,
  Bucket: AWS_BUCKET_NAME,
});


// Helper method to resize an article image
const ResizeAndUploadImage = (image, keyName, newSize, title, cb) => {
  // Error check
  if (!image || !newSize || !keyName) {
    cb({
      success: false,
      error: 'All parameters must be provided.',
    });
    return;
  }

  // Convert article picture to a form that s3 can display
  const imageConverted = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  // Resize to be appropriate size
  sharp(imageConverted)
  .resize(newSize, null)
  .toBuffer()
  .then(resized => {
    // Create bucket
    var params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `${keyName}/${title ? title + '/' : null}${uuid()}`,
      ContentType: 'image/jpeg',
      Body: resized,
      ContentEncoding: 'base64',
      ACL: 'public-read',
    };
    // Upload photo
    s3bucket.upload(params, (errUpload, data) => {
      if (errUpload) {
        cb({
          success: false,
          error: 'Error uploading image.',
        });
        return;
      }
      cb({
        success: true,
        error: '',
        resizedImg: data.Location,
      });
      return;
    });
  });
};

module.exports = {
  ResizeAndUploadImage,
};
