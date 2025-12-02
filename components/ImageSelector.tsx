
import React from 'react';
import type { CartItem } from '../types';
import { TrashIcon } from './IconComponents';

interface CartViewProps {
  cart: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onGoToCheckout: () => void;
  onBackToStore: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ cart, onRemoveItem, onGoToCheckout, onBackToStore }) => {

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900">Tu Carrito</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-lg mb-6">Tu carrito está vacío.</p>
          <button
            onClick={onBackToStore}
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Volver a la tienda
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 last:border-b-0">
                <div className="flex items-center gap-6">
                  {item.product.type !== 'giftcard' && (
                     <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{item.product.name}</h3>
                    <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                    {item.description && <p className="text-sm text-slate-500 mt-1">{item.description}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-4 sm:mt-0">
                  <span className="font-bold text-lg text-slate-900">S/ {item.price.toFixed(2)}</span>
                  <button onClick={() => onRemoveItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <TrashIcon className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-100">
             <button
                onClick={onBackToStore}
                className="text-slate-600 font-bold hover:text-indigo-600 transition-colors"
              >
                &larr; Seguir Comprando
              </button>
              <div className="text-center md:text-right">
                  <p className="text-2xl font-bold text-slate-900 mb-4">Total: <span className="text-indigo-600">S/ {total}</span></p>
                  <button
                    onClick={onGoToCheckout}
                    className="bg-indigo-600 text-white font-bold py-3 px-10 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 w-full md:w-auto"
                  >
                    Proceder al Pago
                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
