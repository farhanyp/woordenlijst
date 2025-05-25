// components/FileUpload.tsx
'use client';

import React, { useState, useCallback, memo } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';

interface UploadResponse {
  message: string;
  fileName: string;
  fileSize: number;
  replaced: boolean;
  content: string;
}

interface FileDetails {
  name: string;
  size: number;
  lastModified: string;
  preview: string;
}

const FileUpload: React.FC = memo(() => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [staticFileName, setStaticFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [existingFiles, setExistingFiles] = useState<FileDetails[]>([]);
  const [showExistingFiles, setShowExistingFiles] = useState<boolean>(false);

  // Load existing files
  const loadExistingFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/upload');
      if (response.ok) {
        const data = await response.json();
        setExistingFiles(data.files || []);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.txt') || file.type === 'text/plain') {
        setSelectedFile(file);
        setError('');
        setUploadResult(null);
      } else {
        setError('Please select a .txt file');
        setSelectedFile(null);
      }
    }
  }, []);

  // Handle static filename change
  const handleStaticFileNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setStaticFileName(event.target.value);
    setError('');
  }, []);

  // Handle file upload
  const handleUpload = useCallback(async () => {
    if (!selectedFile || !staticFileName.trim()) {
      setError('Please select a file and enter a static filename');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('staticFileName', staticFileName.trim());

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
        setSelectedFile(null);
        setStaticFileName('');
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Reload existing files
        await loadExistingFiles();
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Network error occurred');
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, staticFileName, loadExistingFiles]);

  // Clear results
  const clearResults = useCallback(() => {
    setUploadResult(null);
    setError('');
  }, []);

  // Load files on mount
  React.useEffect(() => {
    loadExistingFiles();
  }, [loadExistingFiles]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Upload File TXT
        </h2>
        <p className="text-gray-600">
          Upload file .txt dengan nama statik. File yang sudah ada akan di-replace.
        </p>
      </div>

      {/* Upload Form */}
      <div className="space-y-6">
        {/* Static Filename Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama File Statik (tanpa ekstensi)
          </label>
          <input
            type="text"
            value={staticFileName}
            onChange={handleStaticFileNameChange}
            placeholder="contoh: document-master"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isUploading}
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih File TXT
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Klik untuk pilih file .txt'}
                </p>
                {selectedFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    Ukuran: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || !staticFileName.trim() || isUploading}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {(uploadResult || error) && (
        <div className="mt-6">
          {uploadResult && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    Upload Berhasil
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{uploadResult.message}</p>
                    <p className="mt-1">
                      <strong>File:</strong> {uploadResult.fileName} 
                      ({(uploadResult.fileSize / 1024).toFixed(2)} KB)
                    </p>
                    <p className="mt-1">
                      <strong>Status:</strong> {uploadResult.replaced ? 'Replaced' : 'New'}
                    </p>
                    <div className="mt-2">
                      <strong>Preview:</strong>
                      <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                        {uploadResult.content}
                      </pre>
                    </div>
                  </div>
                </div>
                <button onClick={clearResults} className="ml-2">
                  <X className="h-4 w-4 text-green-400 hover:text-green-600" />
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Upload Gagal
                  </h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>
                <button onClick={clearResults} className="ml-2">
                  <X className="h-4 w-4 text-red-400 hover:text-red-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Existing Files */}
      <div className="mt-8">
        <button
          onClick={() => setShowExistingFiles(!showExistingFiles)}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <File className="h-4 w-4 mr-2" />
          File yang Sudah Diupload ({existingFiles.length})
        </button>

        {showExistingFiles && (
          <div className="mt-4 space-y-2">
            {existingFiles.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada file yang diupload</p>
            ) : (
              existingFiles.map((file, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{file.name}</h4>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    Last modified: {new Date(file.lastModified).toLocaleString()}
                  </p>
                  <pre className="text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                    {file.preview}
                  </pre>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;