import http from './http';

export function uploadImage(file, onUploadProgress) {
  let formData = new FormData();
  formData.append('file', file);
  return http.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
}

export function uploadImageV2(data) {
  return http.post('/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function uploadImageV3(file, onUploadProgress) {
  let formData = new FormData();
  formData.append('file', file);

  return http.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
}
