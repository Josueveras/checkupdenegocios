
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  children?: React.ReactNode;
}

export function FileUpload({ 
  onFileSelect, 
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  children 
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= maxSize) {
      onFileSelect(file);
    } else if (file) {
      alert(`Arquivo muito grande. Máximo permitido: ${maxSize / (1024 * 1024)}MB`);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.size <= maxSize) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {children || (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600">
              Clique para selecionar ou arraste um arquivo aqui
            </p>
            <p className="text-xs text-gray-500">
              Máximo {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
