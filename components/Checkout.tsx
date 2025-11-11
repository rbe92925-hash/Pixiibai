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
            <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-3xl font-bold text-green-600 mb-4">¡Pedido realizado con éxito!</h2>
                <p className="text-gray-600 mb-8">Gracias por tu compra. Tus recuerdos están siendo preparados y serán enviados pronto a tu domicilio en Perú.</p>
                <button
                    onClick={onRestart}
                    className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors"
                >
                    Crear un nuevo producto
                </button>
            </div>
        )
    }

  return (
    <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Finalizar Compra</h2>
            <p className="text-lg text-gray-600 mt-2">Revisa tu pedido y completa tus datos para el envío.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
            {/* Order Summary */}
            <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-2xl font-semibold border-b pb-4 mb-6">Resumen del Pedido</h3>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{item.product.name} (x{item.quantity})</p>
                        {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                      </div>
                      <span className="text-gray-700 font-medium">S/ {item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-4 border-t mt-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold text-gray-900">S/ {total}</span>
                </div>
            </div>

            {/* Checkout Form */}
            <div className="md:col-span-3 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-2xl font-semibold mb-6">Datos de Envío</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input type="text" id="name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"/>
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección de Envío</label>
                        <input type="text" id="address" required placeholder="Av. Siempre Viva 123, Springfield" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"/>
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                        <input type="text" id="city" required placeholder="Lima" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"/>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
                        <input type="tel" id="phone" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"/>
                    </div>
                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                        <button type="button" onClick={onBack} className="w-full text-center bg-white border border-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">Volver</button>
                        <button type="submit" className="w-full text-center bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors">Confirmar Pedido</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};