'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileText, Loader2, Sparkles } from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType?: 'person' | 'vehicle' | 'asset';
  entityId?: string;
  onSuccess?: () => void;
}

interface ExtractedData {
  documentType: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuer?: string;
  holderName?: string;
  confidence: number;
  rawText?: string;
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
  entityType,
  entityId,
  onSuccess
}: UploadDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFileType(droppedFile)) {
      setFile(droppedFile);
      setError(null);
      extractDataFromFile(droppedFile);
    } else {
      setError('Please upload a PDF, image (JPG/PNG), or document file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFileType(selectedFile)) {
      setFile(selectedFile);
      setError(null);
      extractDataFromFile(selectedFile);
    } else {
      setError('Please upload a PDF, image (JPG/PNG), or document file');
    }
  };

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'image/heif'
    ];
    return validTypes.includes(file.type);
  };

  const extractDataFromFile = async (file: File) => {
    setIsExtracting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/extract', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to extract data from document');
      }

      const data = await response.json();
      setExtractedData(data.extracted);
    } catch (err) {
      console.error('Extraction error:', err);
      setError('AI extraction failed. You can still upload and enter details manually.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Upload file to Supabase Storage
      const formData = new FormData();
      formData.append('file', file);
      if (entityType) formData.append('entityType', entityType);
      if (entityId) formData.append('entityId', entityId);
      if (extractedData) formData.append('extractedData', JSON.stringify(extractedData));

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Success - close modal and refresh
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatConfidence = (confidence: number): string => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
            <p className="text-sm text-gray-600 mt-1">
              AI will automatically extract key information
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'}
              ${file ? 'bg-gray-50' : 'bg-white'}
            `}
          >
            {!file ? (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 font-medium mb-1">
                  Drop your document here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  PDF, JPG, PNG up to 10MB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 font-medium"
                >
                  Select File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-yellow-500" />
                <div className="text-left">
                  <p className="text-gray-900 font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setExtractedData(null);
                  }}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* AI Extraction Status */}
          {isExtracting && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  AI is analyzing your document...
                </p>
                <p className="text-xs text-blue-700">
                  Extracting expiry dates, numbers, and key information
                </p>
              </div>
            </div>
          )}

          {/* Extracted Data Preview */}
          {extractedData && !isExtracting && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700">
                <Sparkles className="w-5 h-5" />
                <p className="font-medium">AI Extracted Data</p>
                <span className="text-xs px-2 py-1 bg-green-100 rounded">
                  {formatConfidence(extractedData.confidence)} Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Document Type
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {extractedData.documentType || 'Unknown'}
                  </p>
                </div>

                {extractedData.documentNumber && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Document Number
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {extractedData.documentNumber}
                    </p>
                  </div>
                )}

                {extractedData.issueDate && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Issue Date
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(extractedData.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {extractedData.expiryDate && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Expiry Date
                    </label>
                    <p className="text-sm text-gray-900 mt-1 font-semibold">
                      {new Date(extractedData.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {extractedData.issuer && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Issuer
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {extractedData.issuer}
                    </p>
                  </div>
                )}

                {extractedData.holderName && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Holder Name
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {extractedData.holderName}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-600">
                Review the extracted data carefully. You can edit details after upload.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading || isExtracting}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? 'Uploading...' : 'Upload & Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
