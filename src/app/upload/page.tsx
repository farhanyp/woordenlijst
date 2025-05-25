'use client';

import { useState, useCallback, memo } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface UploadResponse {
  message: string;
  url: string;
  publicId: string;
  filename: string;
  fileSize: number;
  replaced: boolean;
  content: string;
}

interface UploadError {
  error: string;
}

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const processFile = useCallback((selectedFile: File) => {
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
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Page Title */}
        <PageTitle />

        {/* Upload Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-8">
            {/* Upload Area */}
            <UploadArea 
              file={file}
              onFileSelect={handleFileSelect}
              onDrag={handleDrag}
              onDrop={handleDrop}
              dragActive={dragActive}
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

// Navigation Header Component
const NavigationHeader = memo(() => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-14 sm:h-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image 
            src="/logo.svg" 
            alt="Woordenlijst Logo" 
            width={200}
            height={40}
            className="h-8 sm:h-10 w-auto"
            priority
          />
        </Link>

        {/* Back Link */}
        <Link 
          href="/"
          className="inline-flex items-center text-accent-500 hover:text-accent-500/80 font-medium transition-colors duration-200 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>
    </div>
  </nav>
));

// Page Title Component
const PageTitle = memo(() => (
  <div className="mb-6 sm:mb-8">
    <h1 className="text-2xl sm:text-3xl font-semibold text-primary-500 mb-2 sm:mb-3">
      Upload Text File
    </h1>
    <p className="text-base sm:text-lg text-text-primary leading-relaxed">
      Upload a text file (.txt) to be saved as "upload.txt". 
      If there's an existing file, it will be replaced with the new one.
    </p>
  </div>
));

// Upload Area Component
const UploadArea = memo<{
  file: File | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  dragActive: boolean;
  error: string | null;
}>(({ file, onFileSelect, onDrag, onDrop, dragActive, error }) => (
  <div className="mb-6 sm:mb-8">
    <label className="block text-base font-medium text-text-primary mb-4">
      Select Text File (.txt)
    </label>
    
    <div 
      className={`
        relative border-2 border-dashed rounded-lg p-6 sm:p-12 text-center transition-all duration-300 ease-in-out
        ${dragActive 
          ? 'border-button-primary bg-button-primary/5 scale-105' 
          : error 
            ? 'border-red-300 bg-red-50' 
            : file 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 hover:border-button-primary hover:bg-gray-50'
        }
      `}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept=".txt,text/plain"
        onChange={onFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
      />
      
      {file ? (
        <FileSelected file={file} />
      ) : (
        <FilePrompt dragActive={dragActive} />
      )}
    </div>
  </div>
));

// File Selected Component
const FileSelected = memo<{ file: File }>(({ file }) => (
  <div className="space-y-3 sm:space-y-4">
    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full">
      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
    </div>
    <div>
      <p className="text-base sm:text-lg font-medium text-gray-900 mb-1 break-all px-2">{file.name}</p>
      <p className="text-sm text-gray-600">
        Size: {(file.size / 1024).toFixed(1)} KB
      </p>
      <p className="text-xs text-blue-600 mt-2">
        File will be saved as "upload.txt"
      </p>
    </div>
    <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
      <CheckCircle className="w-4 h-4 mr-1" />
      Ready to upload
    </div>
  </div>
));

// File Prompt Component
const FilePrompt = memo<{ dragActive: boolean }>(({ dragActive }) => (
  <div className="space-y-3 sm:space-y-4">
    <div className={`
      inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full transition-all duration-300
      ${dragActive ? 'bg-button-primary text-white scale-110' : 'bg-gray-100 text-gray-600'}
    `}>
      <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
    </div>
    <div className="px-2">
      <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
        {dragActive ? 'Drop file here' : 'Click to select file or drag & drop'}
      </p>
      <p className="text-sm text-gray-600">
        Only .txt files with maximum size of 1MB
      </p>
    </div>
  </div>
));

// Action Buttons Component
const ActionButtons = memo<{
  onUpload: () => void;
  onReset: () => void;
  uploading: boolean;
}>(({ onUpload, onReset, uploading }) => (
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
    <button
      onClick={onUpload}
      disabled={uploading}
      className="flex-1 bg-button-primary text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-button-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
    >
      {uploading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
          Uploading...
        </>
      ) : (
        <>
          <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Upload File
        </>
      )}
    </button>
    
    <button
      onClick={onReset}
      disabled={uploading}
      className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200 font-medium text-sm sm:text-base"
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
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
    <div className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2 sm:mb-3">
          {result.replaced ? 'File Successfully Replaced!' : 'Upload Successful!'}
        </h3>
        
        <div className="bg-white rounded-lg border border-green-200 p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">File URL:</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <a 
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-button-primary hover:text-button-secondary text-xs sm:text-sm break-all flex-1"
                >
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}${result.url}`}
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}${result.url}`)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 self-start sm:self-center"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-600">
              <p>File name: {result.filename}.txt</p>
              <p>Size: {(result.fileSize / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onReset}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm sm:text-base"
          >
            Upload New File
          </button>
          <Link
            href="/"
            className="text-center bg-white border border-green-300 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium text-sm sm:text-base"
          >
            Back to Home
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
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
    <div className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">
          Upload Failed
        </h3>
        <p className="text-red-700 text-sm sm:text-base break-words">{error}</p>
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors duration-200 ml-2"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
));

// Info Section Component
const InfoSection = memo(() => (
  <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
    <div className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
        <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <h2 className="text-base sm:text-lg font-semibold text-blue-900 mb-2 sm:mb-3">
          Upload Information
        </h2>
        <ul className="text-blue-800 space-y-1 sm:space-y-2 text-sm sm:text-base">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Only text files (.txt) are allowed
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Maximum file size: 1MB
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            File will be saved as "upload.txt"
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Existing files will be replaced with new uploads
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Files can be accessed via public URL
          </li>
        </ul>
      </div>
    </div>
  </div>
));

// Set display names
NavigationHeader.displayName = 'NavigationHeader';
PageTitle.displayName = 'PageTitle';
UploadArea.displayName = 'UploadArea';
FileSelected.displayName = 'FileSelected';
FilePrompt.displayName = 'FilePrompt';
ActionButtons.displayName = 'ActionButtons';
UploadSuccess.displayName = 'UploadSuccess';
ErrorMessage.displayName = 'ErrorMessage';
InfoSection.displayName = 'InfoSection';

export default UploadPage;