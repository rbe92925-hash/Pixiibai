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
        <h2 className="text-3xl font-bold text-gray-900">Tu Carrito de Compras</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-lg mb-6">Tu carrito está vacío.</p>
          <button
            onClick={onBackToStore}
            className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4 border-b pb-6 last:border-b-0">
                <div className="flex items-center gap-6">
                  {item.product.type !== 'giftcard' && (
                     <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-lg text-gray-800">S/ {item.price.toFixed(2)}</span>
                  <button onClick={() => onRemoveItem(item.id)} className="text-gray-500 hover:text-red-600">
                    <TrashIcon className="w-6 h-6"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
             <button
                onClick={onBackToStore}
                className="bg-white border border-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Seguir Comprando
              </button>
              <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">Total: <span className="text-gray-900">S/ {total}</span></p>
                  <div className="flex gap-4 mt-4">
                      <button
                        onClick={onGoToCheckout}
                        className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors"
                      >
                        Proceder al Pago
                      </button>
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};