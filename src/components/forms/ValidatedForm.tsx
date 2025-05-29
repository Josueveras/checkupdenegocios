
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string; }[];
  validation?: (value: string) => string | null;
}

interface ValidatedFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void> | void;
  submitLabel?: string;
  className?: string;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const ValidatedForm: React.FC<ValidatedFormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Salvar',
  className = '',
  showProgress = false,
  currentStep = 1,
  totalSteps = 1
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} é obrigatório`;
    }

    if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'E-mail inválido';
    }

    if (field.type === 'tel' && value && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) {
      return 'Telefone deve estar no formato (11) 99999-9999';
    }

    if (field.validation) {
      return field.validation(value);
    }

    return null;
  };

  const handleChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleBlur = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = validateField(field, value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formData[field.name] || '';
      const error = validateField(field, value);
      
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      toast({
        title: "Sucesso",
        description: "Dados salvos com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = showProgress ? (currentStep / totalSteps) * 100 : 0;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {showProgress && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Etapa {currentStep} de {totalSteps}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-petrol h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {fields.map(field => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          {field.type === 'select' ? (
            <select
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-petrol ${
                errors[field.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              placeholder={field.placeholder}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-petrol ${
                errors[field.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          ) : (
            <Input
              id={field.name}
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              placeholder={field.placeholder}
              className={errors[field.name] ? 'border-red-500' : ''}
            />
          )}

          {errors[field.name] && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription className="text-sm">
                {errors[field.name]}
              </AlertDescription>
            </Alert>
          )}
        </div>
      ))}

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-petrol hover:bg-petrol/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {isSubmitting ? 'Salvando...' : submitLabel}
      </Button>
    </form>
  );
};
