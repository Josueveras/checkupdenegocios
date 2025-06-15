
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, placeholder = "0,00", className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState('');

    // Update display value when value prop changes
    useEffect(() => {
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      if (!isFocused) {
        // Show formatted value when not focused
        if (!isNaN(numericValue) && numericValue > 0) {
          setDisplayValue(formatCurrency(numericValue));
        } else {
          setDisplayValue('');
        }
      } else {
        // Show raw value when focused
        setDisplayValue(value.toString());
      }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      if (isFocused) {
        // Remove tudo exceto números, pontos e vírgulas
        const numericOnly = inputValue.replace(/[^\d.,]/g, '');
        
        // Converte vírgula para ponto para processamento
        const normalizedValue = numericOnly.replace(',', '.');
        
        setDisplayValue(inputValue);
        onChange(normalizedValue);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setDisplayValue(value.toString());
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      // Format value when losing focus
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      if (!isNaN(numericValue) && numericValue > 0) {
        setDisplayValue(formatCurrency(numericValue));
      } else {
        setDisplayValue('');
      }
      
      onBlur?.(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(className)}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
