export const compressImage = async (file, targetSizeMB = 2) => {
  if (!file || !file.type.startsWith('image/')) {
    return file; // Return original if not an image
  }

  const targetSizeBytes = targetSizeMB * 1024 * 1024;
  if (file.size <= targetSizeBytes) {
    return file; // Already small enough
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Target max width 1200px
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Recursive compression function to hit target size
        const attemptCompression = (quality) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob failed'));
                return;
              }
              if (blob.size <= targetSizeBytes || quality <= 0.3) {
                // Return the compressed blob as a File object
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                // Try again with lower quality
                attemptCompression(quality - 0.1);
              }
            },
            'image/jpeg',
            quality
          );
        };

        // Start with 0.7 quality as per spec
        attemptCompression(0.7);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
