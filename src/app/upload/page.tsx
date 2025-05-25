'use client';

import { useState, useCallback, memo } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

interface UploadResponse {
  message: string;
  url: string;
  publicId: string;
}

interface UploadError {
  error: string;
}

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Reset previous states
      setError(null);
      setUploadResult(null);
      
      // Validate file type
      if (!selectedFile.type.includes('text') && !selectedFile.name.endsWith('.txt')) {
        setError('Only text files (.txt) are allowed');
        return;
      }

      // Validate file size (1MB limit)
      if (selectedFile.size > 1024 * 1024) {
        setError('File size too large. Maximum 1MB allowed.');
        return;
      }

      setFile(selectedFile);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResponse | UploadError = await response.json();

      if (!response.ok) {
        throw new Error((data as UploadError).error || 'Upload failed');
      }

      setUploadResult(data as UploadResponse);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  }, [file]);

  const resetState = useCallback(() => {
    setFile(null);
    setError(null);
    setUploadResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Upload Text File</h1>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {/* Upload Area */}
            <UploadArea 
              file={file}
              onFileSelect={handleFileSelect}
              error={error}
            />

            {/* Action Buttons */}
            {file && !uploadResult && (
              <ActionButtons
                onUpload={handleUpload}
                onReset={resetState}
                uploading={uploading}
              />
            )}

            {/* Upload Result */}
            {uploadResult && (
              <UploadSuccess 
                result={uploadResult}
                onReset={resetState}
              />
            )}

            {/* Error Message */}
            {error && (
              <ErrorMessage 
                error={error}
                onDismiss={() => setError(null)}
              />
            )}
          </div>
        </div>

        {/* Info Section */}
        <InfoSection />
      </main>
    </div>
  );
};

// Upload Area Component
const UploadArea = memo<{
  file: File | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
}>(({ file, onFileSelect, error }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Select Text File (.txt)
    </label>
    
    <div className={`
      border-2 border-dashed rounded-lg p-8 text-center transition-colors
      ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
    `}>
      <input
        type="file"
        accept=".txt,text/plain"
        onChange={onFileSelect}
        className="hidden"
        id="file-upload"
      />
      
      <label htmlFor="file-upload" className="cursor-pointer">
        {file ? (
          <div className="space-y-2">
            <FileText className="w-12 h-12 text-green-500 mx-auto" />
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-sm font-medium text-gray-900">
              Click to select file
            </p>
            <p className="text-xs text-gray-500">
              or drag and drop file here
            </p>
          </div>
        )}
      </label>
    </div>
  </div>
));

// Action Buttons Component
const ActionButtons = memo<{
  onUpload: () => void;
  onReset: () => void;
  uploading: boolean;
}>(({ onUpload, onReset, uploading }) => (
  <div className="flex gap-4 mb-6">
    <button
      onClick={onUpload}
      disabled={uploading}
      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {uploading ? 'Uploading...' : 'Upload File'}
    </button>
    
    <button
      onClick={onReset}
      disabled={uploading}
      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
    >
      Reset
    </button>
  </div>
));

// Upload Success Component
const UploadSuccess = memo<{
  result: UploadResponse;
  onReset: () => void;
}>(({ result, onReset }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
    <div className="flex items-start">
      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <h3 className="text-green-800 font-medium mb-2">Upload Successful!</h3>
        
        <div className="bg-white rounded border p-3 mb-3">
          <p className="text-xs text-gray-600 mb-1">File URL:</p>
          <a 
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm break-all"
          >
            {result.url}
          </a>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="text-green-700 hover:text-green-800 text-sm font-medium"
          >
            Upload New File
          </button>
          <span className="text-gray-400">|</span>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View on Homepage
          </Link>
        </div>
      </div>
    </div>
  </div>
));

// Error Message Component
const ErrorMessage = memo<{
  error: string;
  onDismiss: () => void;
}>(({ error, onDismiss }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <div className="flex items-start">
      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
));

// Info Section Component
const InfoSection = memo(() => (
  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
    <h2 className="text-lg font-medium text-blue-900 mb-3">Upload Information</h2>
    <ul className="text-blue-800 text-sm space-y-1">
      <li>• Only text files (.txt) are allowed</li>
      <li>• Maximum file size: 1MB</li>
      <li>• Files will be stored securely on Cloudinary</li>
      <li>• File URL can be accessed publicly</li>
    </ul>
  </div>
));

// Set display names
UploadArea.displayName = 'UploadArea';
ActionButtons.displayName = 'ActionButtons';
UploadSuccess.displayName = 'UploadSuccess';
ErrorMessage.displayName = 'ErrorMessage';
InfoSection.displayName = 'InfoSection';

export default UploadPage;