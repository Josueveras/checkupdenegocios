
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFormConfig } from '@/hooks/useFormConfig';
import { DynamicField } from '@/utils/leadValidation';
import { Settings, Plus, Trash2, GripVertical } from 'lucide-react';

export function FormBuilder() {
  const { config, addField, removeField, updateField, reorderFields } = useFormConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [newFieldData, setNewFieldData] = useState({
    name: '',
    label: '',
    type: 'text' as DynamicField['type'],
    placeholder: '',
    required: false,
    options: ''
  });

  if (!config) return null;

  const handleAddField = () => {
    if (!newFieldData.name || !newFieldData.label) return;

    const field = {
      name: newFieldData.name.startsWith('custom_') ? newFieldData.name : `custom_${newFieldData.name}`,
      label: newFieldData.label,
      type: newFieldData.type,
      placeholder: newFieldData.placeholder,
      required: newFieldData.required,
      options: newFieldData.type === 'select' ? 
        newFieldData.options.split(',').map(s => s.trim()).filter(Boolean) : 
        undefined
    };

    addField(field);
    setNewFieldData({
      name: '',
      label: '',
      type: 'text',
      placeholder: '',
      required: false,
      options: ''
    });
  };

  const fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Telefone' },
    { value: 'number', label: 'Número' },
    { value: 'textarea', label: 'Área de Texto' },
    { value: 'select', label: 'Seleção' },
    { value: 'checkbox', label: 'Checkbox' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurar Formulário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editor de Formulário</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campos Existentes */}
          <div>
            <h3 className="text-lg font-medium mb-4">Campos do Formulário</h3>
            <div className="space-y-3">
              {config.fields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <Card key={field.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{field.label}</span>
                              {field.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Obrigatório
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {fieldTypes.find(t => t.value === field.type)?.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Campo: {field.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateField(field.id, { required: !field.required })}
                          >
                            <Checkbox checked={field.required} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Novo Campo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fieldName">Nome do Campo</Label>
                  <Input
                    id="fieldName"
                    value={newFieldData.name}
                    onChange={(e) => setNewFieldData({ ...newFieldData, name: e.target.value })}
                    placeholder="Ex: cargo, departamento"
                  />
                </div>
                <div>
                  <Label htmlFor="fieldLabel">Label Exibido</Label>
                  <Input
                    id="fieldLabel"
                    value={newFieldData.label}
                    onChange={(e) => setNewFieldData({ ...newFieldData, label: e.target.value })}
                    placeholder="Ex: Cargo, Departamento"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fieldType">Tipo de Campo</Label>
                  <Select
                    value={newFieldData.type}
                    onValueChange={(value: DynamicField['type']) => 
                      setNewFieldData({ ...newFieldData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                  <Input
                    id="fieldPlaceholder"
                    value={newFieldData.placeholder}
                    onChange={(e) => setNewFieldData({ ...newFieldData, placeholder: e.target.value })}
                    placeholder="Texto de ajuda"
                  />
                </div>
              </div>

              {newFieldData.type === 'select' && (
                <div>
                  <Label htmlFor="fieldOptions">Opções (separadas por vírgula)</Label>
                  <Input
                    id="fieldOptions"
                    value={newFieldData.options}
                    onChange={(e) => setNewFieldData({ ...newFieldData, options: e.target.value })}
                    placeholder="Opção 1, Opção 2, Opção 3"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newFieldData.required}
                  onCheckedChange={(checked) => 
                    setNewFieldData({ ...newFieldData, required: !!checked })
                  }
                />
                <Label>Campo obrigatório</Label>
              </div>

              <Button onClick={handleAddField} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Campo
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
