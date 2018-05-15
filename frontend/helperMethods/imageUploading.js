// Helper method to rotate and resize an image
const processImg = (image, trgHeight, trgWidth, srcWidth, srcHeight, orientation) => {
  var canvas = document.createElement('canvas');
  canvas.width = trgWidth;
  canvas.height = trgHeight;
  var img = new Image;
  img.src = image;
  var ctx = canvas.getContext("2d");
  if (orientation === 2) ctx.transform(-1, 0, 0, 1, trgWidth, 0);
  if (orientation === 3) ctx.transform(-1, 0, 0, -1, trgWidth, trgHeight);
  if (orientation === 4) ctx.transform(1, 0, 0, -1, 0, trgHeight);
  if (orientation === 5) ctx.transform(0, 1, 1, 0, 0, 0);
  if (orientation === 6) ctx.transform(0, 1, -1, 0, trgHeight, 0);
  if (orientation === 7) ctx.transform(0, -1, -1, 0, trgHeight, trgWidth);
  if (orientation === 8) ctx.transform(0, -1, 1, 0, 0, trgWidth);
  ctx.drawImage(img, 0, 0, srcWidth, srcHeight, 0, 0, trgWidth, trgHeight);
  ctx.fill();
  return canvas.toDataURL();
};

// Helper method to maintain correct proportions
const getTargetSize = (img, maxSize) => {
  const targetSize = {
    width: img.width,
    height: img.height,
  };
  if (img.width > img.height) {
    if (img.width > maxSize) {
      targetSize.height = img.height * maxSize / img.width;
      targetSize.width = maxSize;
    }
  } else {
    if (img.height > maxSize) {
      targetSize.width = img.width * maxSize / img.height;
      targetSize.height = maxSize;
    }
  }
  return targetSize;
};

module.exports = {
  processImg,
  getTargetSize
};
