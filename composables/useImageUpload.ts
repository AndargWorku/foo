

// composables/useImageUpload.ts

import { useMutation } from '@vue/apollo-composable';
import { UPLOAD_IMAGE_ACTION } from '~/lib/graphql';

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });

// Remove file extension (.jpg, .png, etc.)
const getFileBaseName = (filename: string): string => {
  const dotIndex = filename.lastIndexOf('.');
  return dotIndex > 0 ? filename.substring(0, dotIndex) : filename;
};

export function useImageUpload() {
  const { mutate: uploadImageAction, loading: isUploading } =
    useMutation(UPLOAD_IMAGE_ACTION);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const imageDataBase64 = await toBase64(file);
      const safeFilename = getFileBaseName(file.name); // ✅ no extension sent

      const result = await uploadImageAction({
        imageDataBase64,
        filename: safeFilename,
      });

      const imageUrl = result?.data?.uploadImage?.imageUrl;
      if (!imageUrl) {
        throw new Error('Image upload failed: No URL returned from server.');
      }

      console.log(`✅ Uploaded "${file.name}" → Final URL: ${imageUrl}`);
      return imageUrl;
    } catch (err) {
      console.error('❌ Image upload failed:', err);
      throw err;
    }
  };

  return { uploadImage, isUploading };
}

