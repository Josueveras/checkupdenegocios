
import { useState, useEffect } from 'react';
import { FormConfig, DynamicField } from '@/types/lead';

const DEFAULT_FORM_CONFIG: FormConfig = {
  id: 'default',
  name: 'Formulário Padrão',
  fields: [
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
    },
    {
      id: 'setor',
      name: 'setor',
      label: 'Setor',
      type: 'text',
      placeholder: 'Ex: Tecnologia, Varejo...',
      required: false,
      order: 5
    },
    {
      id: 'tamanho_empresa',
      name: 'tamanho_empresa',
      label: 'Tamanho da Empresa',
      type: 'select',
      required: false,
      options: ['micro', 'pequena', 'media', 'grande'],
      order: 6
    },
    {
      id: 'fonte_lead',
      name: 'fonte_lead',
      label: 'Fonte do Lead',
      type: 'text',
      placeholder: 'Ex: Site, Indicação, LinkedIn...',
      required: false,
      order: 7
    },
    {
      id: 'urgencia',
      name: 'urgencia',
      label: 'Urgência',
      type: 'select',
      required: false,
      options: ['baixa', 'media', 'alta'],
      order: 8
    },
    {
      id: 'potencial_receita',
      name: 'potencial_receita',
      label: 'Receita Potencial (R$)',
      type: 'number',
      placeholder: '0',
      required: false,
      order: 9
    },
    {
      id: 'orcamento_disponivel',
      name: 'orcamento_disponivel',
      label: 'Orçamento Disponível (R$)',
      type: 'number',
      placeholder: '0',
      required: false,
      order: 10
    },
    {
      id: 'necessidades',
      name: 'necessidades',
      label: 'Necessidades do Cliente',
      type: 'textarea',
      placeholder: 'Descreva as principais necessidades e desafios do cliente...',
      required: false,
      order: 11
    },
    {
      id: 'observacoes',
      name: 'observacoes',
      label: 'Observações Adicionais',
      type: 'textarea',
      placeholder: 'Informações extras sobre o lead...',
      required: false,
      order: 12
    }
  ]
};

const STORAGE_KEY = 'lead-form-config';

export const useFormConfig = () => {
  const [config, setConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);

  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Erro ao carregar configuração do formulário:', error);
      }
    }
  }, []);

  const saveConfig = (newConfig: FormConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
  };

  const addField = (field: Omit<DynamicField, 'id' | 'order'>) => {
    const newField: DynamicField = {
      ...field,
      id: `custom_${Date.now()}`,
      order: Math.max(...config.fields.map(f => f.order), 0) + 1
    };
    
    const newConfig = {
      ...config,
      fields: [...config.fields, newField]
    };
    
    saveConfig(newConfig);
  };

  const removeField = (fieldId: string) => {
    const newConfig = {
      ...config,
      fields: config.fields.filter(f => f.id !== fieldId)
    };
    
    saveConfig(newConfig);
  };

  const updateField = (fieldId: string, updates: Partial<DynamicField>) => {
    const newConfig = {
      ...config,
      fields: config.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      )
    };
    
    saveConfig(newConfig);
  };

  const reorderFields = (fields: DynamicField[]) => {
    const newConfig = {
      ...config,
      fields: fields.map((field, index) => ({
        ...field,
        order: index + 1
      }))
    };
    
    saveConfig(newConfig);
  };

  const resetToDefault = () => {
    saveConfig(DEFAULT_FORM_CONFIG);
  };

  return {
    config,
    saveConfig,
    addField,
    removeField,
    updateField,
    reorderFields,
    resetToDefault
  };
};
