
export const formatCurrency = (value: number | string): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return 'R$ 0';
  
  // Verifica se o valor tem decimais significativos
  const hasDecimals = numericValue % 1 !== 0;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  }).format(numericValue);
};

export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Data inválida';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  } catch {
    return 'Data inválida';
  }
};

export const formatDateShort = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Data inválida';
    
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      year: 'numeric'
    }).format(dateObj);
  } catch {
    return 'Data inválida';
  }
};

export const formatPercentage = (value: number): string => {
  if (isNaN(value)) return '0%';
  return `${Math.round(value)}%`;
};

export const formatROI = (value: number): string => {
  if (isNaN(value)) return '0x';
  return `${value.toFixed(1)}x`;
};
