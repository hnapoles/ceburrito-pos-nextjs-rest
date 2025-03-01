import { useState } from 'react';

export function useFileUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setValue: any,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Simulated API response here - TODO
    const imageUrl = 'http://localhost:3000/images/products/heart.png';
    setValue('imageUrl', imageUrl);
    setImagePreview(imageUrl);
  };

  return { handleFileUpload, imagePreview };
}
