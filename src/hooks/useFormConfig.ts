
import { useState, useEffect } from 'react';
import { DynamicField, FormConfig } from '@/utils/leadValidation';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_FIELDS: DynamicField[] = [
  {
    id: 'empresa_nome',
    name: 'empresa_nome',
    label: 'Nome da Empresa',
    type: 'text',
    placeholder: 'Ex: Empresa ABC Ltda',
    required: false,
    order: 1
  },
  {
    id: 'contato_nome',
    name: 'contato_nome',
    label: 'Nome do Contato',
    type: 'text',
    placeholder: 'Ex: João Silva',
    required: false,
    order: 2
  },
  {
    id: 'email',
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'contato@empresa.com',
    required: false,
    order: 3
  },
  {
    id: 'telefone',
    name: 'telefone',
    label: 'Telefone',
    type: 'tel',
    placeholder: '(11) 99999-9999',
    required: false,
    order: 4
  }
];

const STORAGE_KEY = 'crm_form_config';

export const useFormConfig = () => {
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setConfig(JSON.parse(saved));
      } else {
        // Criar configuração padrão
        const defaultConfig: FormConfig = {
          id: 'default',
          name: 'Formulário Padrão',
          fields: DEFAULT_FIELDS,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setConfig(defaultConfig);
        saveConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      toast({
        title: "Erro ao carregar configuração",
        description: "Usando configuração padrão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = (newConfig: FormConfig) => {
    try {
      const updatedConfig = {
        ...newConfig,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
      setConfig(updatedConfig);
      toast({
        title: "Configuração salva!",
        description: "O formulário foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive"
      });
    }
  };

  const addField = (field: Omit<DynamicField, 'id' | 'order'>) => {
    if (!config) return;
    
    const newField: DynamicField = {
      ...field,
      id: `field_${Date.now()}`,
      order: Math.max(...config.fields.map(f => f.order)) + 1
    };
    
    const updatedConfig = {
      ...config,
      fields: [...config.fields, newField]
    };
    
    saveConfig(updatedConfig);
  };

  const removeField = (fieldId: string) => {
    if (!config) return;
    
    const updatedConfig = {
      ...config,
      fields: config.fields.filter(f => f.id !== fieldId)
    };
    
    saveConfig(updatedConfig);
  };

  const updateField = (fieldId: string, updates: Partial<DynamicField>) => {
    if (!config) return;
    
    const updatedConfig = {
      ...config,
      fields: config.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      )
    };
    
    saveConfig(updatedConfig);
  };

  const reorderFields = (fields: DynamicField[]) => {
    if (!config) return;
    
    const orderedFields = fields.map((field, index) => ({
      ...field,
      order: index + 1
    }));
    
    const updatedConfig = {
      ...config,
      fields: orderedFields
    };
    
    saveConfig(updatedConfig);
  };

  return {
    config,
    loading,
    addField,
    removeField,
    updateField,
    reorderFields,
    saveConfig
  };
};
