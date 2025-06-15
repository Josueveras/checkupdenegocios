
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface ServicesListProps {
  services: string[];
  onChange: (services: string[]) => void;
}

export const ServicesList = ({ services, onChange }: ServicesListProps) => {
  const [newService, setNewService] = useState('');

  const addService = () => {
    if (newService.trim()) {
      onChange([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    onChange(updatedServices);
  };

  const updateService = (index: number, value: string) => {
    const updatedServices = services.map((service, i) => 
      i === index ? value : service
    );
    onChange(updatedServices);
  };

  return (
    <div className="space-y-3">
      <Label>Serviços</Label>
      
      {/* Lista de serviços existentes */}
      <div className="space-y-2">
        {services.map((service, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={service}
              onChange={(e) => updateService(index, e.target.value)}
              placeholder="Digite o serviço..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeService(index)}
              className="px-2 py-1 h-9 w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Campo para adicionar novo serviço */}
      <div className="flex items-center gap-2">
        <Input
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          placeholder="Digite um novo serviço..."
          className="flex-1"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addService();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addService}
          className="px-2 py-1 h-9 w-9"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {services.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Nenhum serviço adicionado ainda. Clique em + para adicionar.
        </p>
      )}
    </div>
  );
};
