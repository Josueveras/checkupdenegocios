
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
  fallbackRoute?: string;
}

export function BackButton({ className = "", onClick, fallbackRoute = "/dashboard" }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Use navigate com -1 para voltar, mas com fallback para dashboard
      try {
        navigate(-1);
      } catch {
        navigate(fallbackRoute);
      }
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </Button>
  );
}
