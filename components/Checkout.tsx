
import React, { useState } from 'react';
import type { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onBack: () => void;
  onRestart: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, onBack, onRestart }) => {
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    
    const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsOrderPlaced(true);
    };

    if (isOrderPlaced) {
        return (
            <div className="max-w-xl mx-auto text-center bg-white p-12 rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">¡Pedido realizado!</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">Gracias por tu compra. Tus recuerdos están siendo preparados con mucho cariño y serán enviados pronto.</p>
                <button
                    onClick={onRestart}
                    className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    Volver al inicio
                </button>
            </div>
        )
    }

  return (
    <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Finalizar Compra</h2>
            <p className="text-lg text-slate-500 mt-2 font-light">Un último paso para tener tus recuerdos contigo.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
            {/* Order Summary */}
            <div className="md:col-span-2 order-2 md:order-1">
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 sticky top-24">
                    <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">Resumen del Pedido</h3>
                    <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-slate-700">{item.product.name} <span className="text-slate-400 text-xs ml-1">x{item.quantity}</span></p>
                            {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                        </div>
                        <span className="text-slate-700 font-medium">S/ {item.price.toFixed(2)}</span>
                        </div>
                    ))}
                    </div>
                    <div className="flex justify-between pt-6 border-t border-slate-200 mt-6">
                        <span className="text-lg font-bold text-slate-800">Total:</span>
                        <span className="text-xl font-bold text-indigo-700">S/ {total}</span>
                    </div>
                </div>
            </div>

            {/* Checkout Form */}
            <div className="md:col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 order-1 md:order-2">
                <h3 className="text-2xl font-bold text-slate-800 mb-8">Datos de Envío</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                        <input type="text" id="name" required className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3"/>
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1">Dirección de Envío</label>
                        <input type="text" id="address" required placeholder="Av. Larco 123, Miraflores" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3"/>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-1">Ciudad</label>
                            <input type="text" id="city" required placeholder="Lima" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3"/>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                            <input type="tel" id="phone" required className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5 px-3"/>
                        </div>
                    </div>
                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                        <button type="button" onClick={onBack} className="w-full text-center text-slate-500 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors">Volver</button>
                        <button type="submit" className="w-full text-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Confirmar Pedido</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};
