
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FileUploadProps {
  onFileUploaded: (fileUrl: string) => void;
  defaultValue?: string;
  label?: string;
  acceptedTypes?: string;
  className?: string;
}

export function FileUpload({
  onFileUploaded,
  defaultValue = '',
  label = 'Carregar arquivo',
  acceptedTypes = 'image/*',
  className = '',
}: FileUploadProps) {
  const [fileUrl, setFileUrl] = useState<string>(defaultValue);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultValue) {
      setFileUrl(defaultValue);
    }
  }, [defaultValue]);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(data.path);

      if (publicUrlData) {
        setFileUrl(publicUrlData.publicUrl);
        onFileUploaded(publicUrlData.publicUrl);
      }
    } catch (err) {
      setError('Erro ao fazer upload do arquivo');
      console.error('Erro de upload:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadFile(file);
    }
  };

  const handleRemoveFile = () => {
    setFileUrl('');
    onFileUploaded('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {fileUrl ? (
        <div className="relative">
          {acceptedTypes.includes('image/') ? (
            <img
              src={fileUrl}
              alt="Arquivo carregado"
              className="max-h-40 object-contain rounded border"
            />
          ) : (
            <div className="p-4 border rounded bg-gray-50 text-sm">
              Arquivo carregado com sucesso
            </div>
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept={acceptedTypes}
              onChange={handleFileChange}
              disabled={uploading}
            />
            <div className="flex flex-col items-center justify-center text-center">
              {uploading ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
              )}
              <span className="text-sm font-medium text-gray-900">
                {uploading ? 'Enviando...' : label}
              </span>
              <span className="text-xs text-gray-600 mt-1">
                {uploading
                  ? 'Aguarde enquanto fazemos o upload'
                  : 'Clique ou arraste o arquivo aqui'}
              </span>
            </div>
          </label>
          {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
      )}
    </div>
  );
}
