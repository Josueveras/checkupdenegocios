
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

export function BackButton({ className = "", onClick }: BackButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
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
