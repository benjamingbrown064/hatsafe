'use client'

import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useRef } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  currentFile?: File | null
}

export default function FileUpload({
  onFileSelect,
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  maxSize = 10,
  currentFile = null,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(currentFile)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type not accepted. Please upload: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      return `File size exceeds ${maxSize}MB limit`
    }

    return null
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
      } else {
        setSelectedFile(file)
        onFileSelect(file)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
      } else {
        setSelectedFile(file)
        onFileSelect(file)
      }
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div>
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragging
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />

          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm font-medium text-gray-900">
            Drop files here or click to upload
          </p>
          <p className="mt-2 text-xs text-gray-600">
            Accepted: {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} (max {maxSize}MB)
          </p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded flex items-center justify-center">
                <span className="text-xl">📄</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-600">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={handleClearFile}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}
    </div>
  )
}
