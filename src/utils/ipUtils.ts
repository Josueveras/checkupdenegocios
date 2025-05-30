
// Função para obter IP do usuário (simplificada)
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (error) {
    console.warn('Erro ao obter IP:', error);
    return 'unknown';
  }
};
