const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddplaf2ko';

export const resolveImageUrl = (image) => {
  if (!image || typeof image !== 'string') return '';

  const trimmed = image.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:')) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;

  if (trimmed.includes('res.cloudinary.com')) {
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed.replace(/^\/+/, '')}`;
  }

  const path = trimmed.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${path}`;
};
