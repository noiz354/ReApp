import { getApiClient } from '../api/AbstractApiClient';

export const fileService = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await getApiClient(1).post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },

  getFile: async (filename: string) => {
    const { data } = await getApiClient(1).get(`/files/${filename}`, {
      responseType: 'arraybuffer',
    });
    return data;
  },
};
