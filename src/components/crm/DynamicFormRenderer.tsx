
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DynamicField } from '@/utils/leadValidation';

interface DynamicFormRendererProps {
  fields: DynamicField[];
  form: UseFormReturn<any>;
}

export function DynamicFormRenderer({ fields, form }: DynamicFormRendererProps) {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const renderField = (field: DynamicField) => {
    const fieldName = field.name.startsWith('custom_') ? 
      `custom_fields.${field.name.replace('custom_', '')}` : 
      field.name;

    return (
      <FormField
        key={field.id}
        control={form.control}
        name={fieldName}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {renderInput(field, formField)}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderInput = (field: DynamicField, formField: any) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            {...formField}
            rows={3}
          />
        );
      
      case 'select':
        return (
          <Select onValueChange={formField.onChange} value={formField.value}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
            <span className="text-sm">{field.placeholder}</span>
          </div>
        );
      
      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            {...formField}
            onChange={(e) => {
              const value = field.type === 'number' ? 
                Number(e.target.value) : 
                e.target.value;
              formField.onChange(value);
            }}
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedFields.map(renderField)}
    </div>
  );
}
