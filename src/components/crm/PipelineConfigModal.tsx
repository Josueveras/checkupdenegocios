
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PipelineColumn } from '@/types/pipeline';
import { usePipelineConfig } from '@/hooks/usePipelineConfig';
import { Plus, Trash, Save, RotateCcw, GripVertical } from 'lucide-react';

const columnSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
  type: z.enum(['normal', 'ganho', 'perdido'])
});

type ColumnFormData = z.infer<typeof columnSchema>;

interface PipelineConfigModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorOptions = [
  { value: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Azul', preview: 'bg-blue-100' },
  { value: 'bg-green-100 text-green-800 border-green-200', label: 'Verde', preview: 'bg-green-100' },
  { value: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Amarelo', preview: 'bg-yellow-100' },
  { value: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Roxo', preview: 'bg-purple-100' },
  { value: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Laranja', preview: 'bg-orange-100' },
  { value: 'bg-red-100 text-red-800 border-red-200', label: 'Vermelho', preview: 'bg-red-100' },
  { value: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Esmeralda', preview: 'bg-emerald-100' },
  { value: 'bg-pink-100 text-pink-800 border-pink-200', label: 'Rosa', preview: 'bg-pink-100' }
];

export function PipelineConfigModal({ isOpen, onOpenChange }: PipelineConfigModalProps) {
  const { columns, addColumn, updateColumn, removeColumn, resetToDefault } = usePipelineConfig();
  const [editingColumn, setEditingColumn] = useState<PipelineColumn | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const form = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      name: '',
      color: colorOptions[0].value,
      type: 'normal'
    }
  });

  const startEdit = (column: PipelineColumn) => {
    setEditingColumn(column);
    setIsAddingNew(false);
    form.reset({
      name: column.name,
      color: column.color,
      type: column.type
    });
  };

  const startAdd = () => {
    setIsAddingNew(true);
    setEditingColumn(null);
    form.reset({
      name: '',
      color: colorOptions[0].value,
      type: 'normal'
    });
  };

  const handleSubmit = (data: ColumnFormData) => {
    if (isAddingNew) {
      addColumn(data);
    } else if (editingColumn) {
      updateColumn(editingColumn.id, data);
    }
    
    setEditingColumn(null);
    setIsAddingNew(false);
    form.reset();
  };

  const handleCancel = () => {
    setEditingColumn(null);
    setIsAddingNew(false);
    form.reset();
  };

  const getTypeLabel = (type: PipelineColumn['type']) => {
    switch (type) {
      case 'ganho': return 'Ganho';
      case 'perdido': return 'Perdido';
      default: return 'Normal';
    }
  };

  const getTypeColor = (type: PipelineColumn['type']) => {
    switch (type) {
      case 'ganho': return 'bg-green-100 text-green-800';
      case 'perdido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Pipeline</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lista de colunas existentes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Colunas do Pipeline</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetToDefault} size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Resetar
                </Button>
                <Button onClick={startAdd} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Coluna
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {columns.map((column) => (
                <Card key={column.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <Badge className={column.color}>
                        {column.name}
                      </Badge>
                      <Badge variant="outline" className={getTypeColor(column.type)}>
                        {getTypeLabel(column.type)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(column)}>
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeColumn(column.id)}
                        disabled={columns.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulário de edição/criação */}
          {(editingColumn || isAddingNew) && (
            <Card className="p-4">
              <h4 className="font-medium mb-4">
                {isAddingNew ? 'Nova Coluna' : `Editar: ${editingColumn?.name}`}
              </h4>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Coluna</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Novo Lead" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {colorOptions.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded ${color.preview}`} />
                                    {color.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="ganho">Ganho (contabiliza como conversão)</SelectItem>
                              <SelectItem value="perdido">Perdido (contabiliza como perda)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
