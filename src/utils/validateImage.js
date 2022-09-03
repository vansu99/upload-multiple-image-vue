export function validateImage(file) {
  const isLtSizeImage = file.size / 1024 / 1024 < 5;
  const isTypeFileName = /\.(jpeg|jpg)$/i.test(file.name);

  if (!isTypeFileName) {
    alert('Avatar picture must be JPG or JPEG format!');
  }

  if (!isLtSizeImage) {
    alert('Avatar picture size can not exceed 5MB!');
  }

  return isLtSizeImage && isTypeFileName;
}
