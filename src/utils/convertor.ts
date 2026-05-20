import { BASEURL } from '../services/api/apiClient';

export const timeConverter = (time: any) => {
  const converted = time.split('T')[0];
  return converted;
};

export const imageUrl = (url: string | undefined | null) => {
  return `${BASEURL}/${url}`;
};

export const getAttachmentUrl = (url?: string) => {
  if (!url) return '#';
  if (/^https?:\/\//i.test(url)) return url;

  const base = (BASEURL || 'http://localhost:5025').replace(/\/+$/, '');
  const normalizedUrl = url.replace(/^\/+/, '');
  return `${base}/${normalizedUrl}`;
};
