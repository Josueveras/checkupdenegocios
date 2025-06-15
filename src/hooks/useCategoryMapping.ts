
// Hook para mapear categorias dinâmicas para as 4 colunas fixas do banco
export const useCategoryMapping = () => {
  
  // Mapear categoria dinâmica para uma das 4 colunas fixas
  const mapCategoryToColumn = (category: string): 'marketing' | 'vendas' | 'estrategia' | 'gestao' => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('marketing') || categoryLower.includes('comunicação')) {
      return 'marketing';
    } else if (categoryLower.includes('vendas') || categoryLower.includes('comercial')) {
      return 'vendas';
    } else if (categoryLower.includes('estratégia') || categoryLower.includes('planejamento') || categoryLower.includes('financeiro')) {
      return 'estrategia';
    } else {
      // Tecnologia, RH, Gestão, etc. → gestão
      return 'gestao';
    }
  };

  // Converter scores dinâmicos para as 4 colunas fixas
  const mapDynamicScoresToFixedColumns = (categoryScores: {[key: string]: number}) => {
    const mappedScores = {
      marketing: 0,
      vendas: 0,
      estrategia: 0,
      gestao: 0
    };

    Object.entries(categoryScores).forEach(([category, score]) => {
      const columnKey = mapCategoryToColumn(category);
      // Se várias categorias mapeiam para a mesma coluna, usar a maior pontuação
      mappedScores[columnKey] = Math.max(mappedScores[columnKey], score);
    });

    return mappedScores;
  };

  // Reconstruir scores dinâmicos a partir das 4 colunas fixas (para visualização)
  const reconstructDynamicScores = (diagnostic: any, originalCategoryScores?: {[key: string]: number}) => {
    // Se temos os scores originais calculados, usar eles
    if (originalCategoryScores) {
      return originalCategoryScores;
    }

    // Fallback: usar as 4 colunas fixas
    return {
      'Marketing': diagnostic.score_marketing || 0,
      'Vendas': diagnostic.score_vendas || 0,
      'Estratégia': diagnostic.score_estrategia || 0,
      'Gestão': diagnostic.score_gestao || 0
    };
  };

  return {
    mapCategoryToColumn,
    mapDynamicScoresToFixedColumns,
    reconstructDynamicScores
  };
};
