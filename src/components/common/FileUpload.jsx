import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { compressImage } from '../../utils/imageCompression';
import { UploadCloud, File as FileIcon, X, CheckCircle2, FileText, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function FileUpload({
  label,
  acceptedFileTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
  },
  maxSizeMB = 5,
  value,
  onChange,
  error,
  required,
}) {
  const [file, setFile] = useState(value || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Sync value prop to internal state
  useEffect(() => {
    if (value !== undefined) {
      setFile(value);
    }
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      setLocalError(null);

      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0].code === 'file-too-large') {
          setLocalError(`File exceeds maximum size of ${maxSizeMB}MB`);
        } else if (rejection.errors[0].code === 'file-invalid-type') {
          setLocalError('Invalid file type');
        } else {
          setLocalError(rejection.errors[0].message);
        }
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        
        if (selectedFile.type.startsWith('image/')) {
          setIsCompressing(true);
          try {
            const compressedFile = await compressImage(selectedFile, maxSizeMB);
            // Add original size for UI comparison
            compressedFile.originalSize = selectedFile.size;
            setFile(compressedFile);
            onChange(compressedFile);
          } catch (err) {
            console.error('Compression failed', err);
            setLocalError('Failed to process image');
          } finally {
            setIsCompressing(false);
          }
        } else {
          // PDF or other non-image
          setFile(selectedFile);
          onChange(selectedFile);
        }
      }
    },
    [maxSizeMB, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    onChange(null);
    setLocalError(null);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Ensure we have a valid Blob URL if file is a File object for preview
  const previewUrl = file && file.type?.startsWith('image/') ? URL.createObjectURL(file) : null;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      )}

      {file && !isCompressing ? (
        <div className="relative flex items-center p-3 border border-accent/30 bg-accent/5 rounded-lg">
          <div className="flex-shrink-0 mr-4">
            {file.type?.startsWith('image/') ? (
              <img src={previewUrl} alt="Preview" className="h-12 w-12 object-cover rounded shadow-sm" />
            ) : (
              <FileText className="h-10 w-10 text-primary opacity-80" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name || 'Uploaded File'}
            </p>
            <div className="flex items-center text-xs text-gray-500 gap-2">
              <span>{formatSize(file.size)}</span>
              {file.originalSize && file.size < file.originalSize && (
                <span className="text-accent font-medium bg-white px-1.5 py-0.5 rounded-full border border-accent/20">
                  Compressed from {formatSize(file.originalSize)}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 ml-4">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-gray-400 hover:text-error hover:bg-error/10 rounded-full transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={clsx(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            {
              "border-primary bg-primary/5": isDragActive,
              "border-error bg-error/5": error || localError,
              "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400": !isDragActive && !error && !localError,
            }
          )}
        >
          <input {...getInputProps()} />
          
          {isCompressing ? (
            <div className="flex flex-col items-center text-primary">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-sm font-medium">Compressing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadCloud className={clsx("h-10 w-10 mb-3", {
                "text-primary": isDragActive,
                "text-error": error || localError,
                "text-gray-400": !isDragActive && !error && !localError
              })} />
              <p className="text-sm font-medium text-gray-700 text-center">
                <span className="text-primary hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG up to {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
      )}

      {(error || localError) && (
        <p className="text-sm text-error mt-1 flex items-start gap-1" role="alert" aria-live="polite">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {localError || error?.message || error}
        </p>
      )}
    </div>
  );
}
