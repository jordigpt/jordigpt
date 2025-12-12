import React from 'react';
import { cn } from '@/lib/utils';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const PillButton = ({ children, className, ...props }: PillButtonProps) => {
  return (
    <button
      className={cn(
        // Estilos base
        'inline-flex items-center justify-center whitespace-nowrap',
        'font-bold uppercase tracking-wide text-black text-sm',
        // Forma y tamaño
        'rounded-full px-8 py-4',
        // Fondo y Borde (Efecto "Glassy")
        'border border-white/20 backdrop-blur-md',
        // Gradiente de fondo con tu color de marca
        'bg-gradient-to-br from-neon to-yellow-300',
        // Sombra para el efecto "Glow"
        'shadow-[0_10px_30px_-10px_rgba(212,232,58,0.6)]',
        // Transiciones
        'transition-all duration-300 ease-in-out',
        // Estados Hover y Active
        'hover:scale-105 hover:shadow-[0_15px_40px_-10px_rgba(212,232,58,0.8)]',
        'active:scale-95',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};