
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useFormConfig } from '@/hooks/useFormConfig';
import { DynamicField } from '@/types/lead';
import { Settings, Plus, Trash, GripVertical, Save } from 'lucide-react';

export function FormBuilder() {
  const { config, addField, removeField, updateField, reorderFields, resetToDefault } = useFormConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [newField, setNewField] = useState<Partial<DynamicField>>({
    name: '',
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    options: []
  });
  const [newFieldOptions, setNewFieldOptions] = useState('');

  const handleAddField = () => {
    if (!newField.name || !newField.label) return;

    const fieldToAdd: Omit<DynamicField, 'id' | 'order'> = {
      name: newField.name,
      label: newField.label,
      type: newField.type || 'text',
      placeholder: newField.placeholder,
      required: newField.required || false,
      options: newField.type === 'select' ? newFieldOptions.split(',').map(opt => opt.trim()).filter(Boolean) : undefined
    };

    addField(fieldToAdd);
    
    // Reset form
    setNewField({
      name: '',
      label: '',
      type: 'text',
      placeholder: '',
      required: false,
      options: []
    });
    setNewFieldOptions('');
  };

  const handleRemoveField = (fieldId: string) => {
    if (window.confirm('Tem certeza que deseja remover este campo?')) {
      removeField(fieldId);
    }
  };

  const toggleRequired = (fieldId: string, required: boolean) => {
    updateField(fieldId, { required });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configurar Formulário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuração do Formulário de Leads</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campos Existentes */}
          <div>
            <h3 className="text-lg font-medium mb-4">Campos do Formulário</h3>
            <div className="space-y-3">
              {config.fields.map((field) => (
                <Card key={field.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{field.label}</span>
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">
                                Obrigatório
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Campo: {field.name}
                            {field.placeholder && ` • Placeholder: "${field.placeholder}"`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => toggleRequired(field.id, checked)}
                          />
                          <Label className="text-xs">Obrigatório</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveField(field.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Adicionar Novo Campo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Novo Campo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Campo</Label>
                  <Input
                    placeholder="Ex: campo_personalizado"
                    value={newField.name || ''}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Label Exibido</Label>
                  <Input
                    placeholder="Ex: Campo Personalizado"
                    value={newField.label || ''}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo do Campo</Label>
                  <Select
                    value={newField.type}
                    onValueChange={(value) => setNewField({ ...newField, type: value as DynamicField['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tel">Telefone</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="textarea">Área de Texto</SelectItem>
                      <SelectItem value="select">Seleção</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Placeholder</Label>
                  <Input
                    placeholder="Texto de exemplo..."
                    value={newField.placeholder || ''}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  />
                </div>
              </div>

              {newField.type === 'select' && (
                <div>
                  <Label>Opções (separadas por vírgula)</Label>
                  <Textarea
                    placeholder="Opção 1, Opção 2, Opção 3"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newField.required || false}
                  onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                />
                <Label>Campo obrigatório</Label>
              </div>

              <Button onClick={handleAddField} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Campo
              </Button>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetToDefault}>
              Restaurar Padrão
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configuração
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
