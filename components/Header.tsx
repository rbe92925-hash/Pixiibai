
import React from 'react';
import { ShoppingCartIcon } from './IconComponents';

interface HeaderProps {
    onRestart: () => void;
    cartItemCount: number;
    onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRestart, cartItemCount, onCartClick }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-indigo-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 
                    className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 cursor-pointer tracking-tight"
                    onClick={onRestart}
                >
                    Pixibai
                </h1>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onRestart}
                        className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        Inicio
                    </button>
                    <button onClick={onCartClick} className="relative text-slate-500 hover:text-indigo-600 transition-colors" aria-label="Ver carrito">
                        <ShoppingCartIcon className="w-6 h-6" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};
