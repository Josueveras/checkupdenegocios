
// Função para detectar bot através do honeypot
export const detectBot = (element: HTMLElement): boolean => {
  const honeypotField = element.querySelector('input[name="website_url"]') as HTMLInputElement;
  if (honeypotField && honeypotField.value && honeypotField.value.trim() !== "") {
    console.warn('Bot detectado: campo honeypot preenchido');
    return true;
  }
  return false;
};

// Delay artificial para proteção anti-spam
export const addSpamProtectionDelay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
};
