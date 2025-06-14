
import { useState, useEffect } from 'react';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([
    "Marketing", 
    "Vendas", 
    "Estratégia", 
    "Gestão", 
    "Tecnologia"
  ]);

  // Carregar categorias do localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('question_categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Salvar categorias no localStorage
  const saveCategories = (newCategories: string[]) => {
    setCategories(newCategories);
    localStorage.setItem('question_categories', JSON.stringify(newCategories));
  };

  const addCategory = (category: string) => {
    if (category.trim() && !categories.includes(category.trim())) {
      const newCategories = [...categories, category.trim()];
      saveCategories(newCategories);
      return true;
    }
    return false;
  };

  const removeCategory = (category: string) => {
    const newCategories = categories.filter(cat => cat !== category);
    saveCategories(newCategories);
  };

  return {
    categories,
    addCategory,
    removeCategory
  };
};
