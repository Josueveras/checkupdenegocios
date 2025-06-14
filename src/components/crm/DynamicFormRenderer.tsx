
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DynamicField } from '@/types/lead';
import { leadSchema, LeadFormData } from '@/utils/leadValidation';

interface DynamicFormRendererProps {
  fields: DynamicField[];
  defaultValues?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => void;
  children?: (form: ReturnType<typeof useForm<LeadFormData>>) => React.ReactNode;
}

export function DynamicFormRenderer({ 
  fields, 
  defaultValues = {}, 
  onSubmit, 
  children 
}: DynamicFormRendererProps) {
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'novo',
      responsavel: 'Sistema',
      urgencia: 'media',
      score_qualificacao: 0,
      potencial_receita: 0,
      orcamento_disponivel: 0,
      custom_fields: {},
      ...defaultValues
    }
  });

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const renderField = (field: DynamicField) => {
    const fieldName = field.name as keyof LeadFormData;

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
              {renderFieldInput(field, formField)}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderFieldInput = (field: DynamicField, formField: any) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            rows={3}
            {...formField}
          />
        );
      
      case 'select':
        return (
          <Select onValueChange={formField.onChange} value={formField.value || ''}>
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'micro' && 'Micro (até 9 funcionários)'}
                  {option === 'pequena' && 'Pequena (10-49 funcionários)'}
                  {option === 'media' && 'Média (50-249 funcionários)'}
                  {option === 'grande' && 'Grande (250+ funcionários)'}
                  {option === 'baixa' && 'Baixa'}
                  {option === 'media' && 'Média'}
                  {option === 'alta' && 'Alta'}
                  {!['micro', 'pequena', 'media', 'grande', 'baixa', 'alta'].includes(option) && option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formField.value || false}
              onCheckedChange={formField.onChange}
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            {...formField}
            onChange={(e) => formField.onChange(Number(e.target.value) || 0)}
          />
        );
      
      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            {...formField}
          />
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedFields.map(renderField)}
        </div>
        {children && children(form)}
      </form>
    </Form>
  );
}
