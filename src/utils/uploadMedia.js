import { mediaAPI } from '../api';

export const uploadMediaIfPresent = async (file) => {
  if (!file) {
    return { media_url: null, media_type: null, attachments: [] };
  }

  const response = await mediaAPI.upload(file);
  return {
    media_url: response.data.url,
    media_type: response.data.media_type,
    attachments: [response.data.url],
  };
};
