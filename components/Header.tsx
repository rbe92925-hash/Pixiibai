import React from 'react';
import { ShoppingCartIcon } from './IconComponents';

interface HeaderProps {
    onRestart: () => void;
    cartItemCount: number;
    onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRestart, cartItemCount, onCartClick }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 
                    className="text-3xl font-bold text-gray-900 cursor-pointer tracking-tight"
                    onClick={onRestart}
                >
                    Pixibai
                </h1>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onRestart}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Empezar de nuevo
                    </button>
                    <button onClick={onCartClick} className="relative text-gray-600 hover:text-gray-900 transition-colors" aria-label="Ver carrito">
                        <ShoppingCartIcon className="w-6 h-6" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};