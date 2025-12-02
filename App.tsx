
import React, { useState, useCallback, useMemo } from 'react';
import type { Product, CartItem, AppView } from './types';
import { Header } from './components/Header';
import { Storefront } from './components/ProductSelector';
import { ProductCustomizer } from './components/Customizer';
import { CartView } from './components/ImageSelector';
import { Checkout } from './components/Checkout';
import { ChatWidget } from './components/ChatWidget';
import { Footer } from './components/Footer';
import { products as productData } from './data';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('STOREFRONT');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setView('PRODUCT_CUSTOMIZER');
  }, []);

  const handleAddToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    setCart(prevCart => [...prevCart, { ...item, id: crypto.randomUUID() }]);
    setView('CART');
  }, []);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  const navigateTo = useCallback((targetView: AppView) => {
    setView(targetView);
  }, []);

  const restart = useCallback(() => {
    setView('STOREFRONT');
    setCart([]);
    setSelectedProduct(null);
  }, []);

  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const currentViewComponent = useMemo(() => {
    switch (view) {
      case 'STOREFRONT':
        return <Storefront products={productData} onSelectProduct={handleProductSelect} />;
      case 'PRODUCT_CUSTOMIZER':
        return selectedProduct ? (
          <ProductCustomizer
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => setView('STOREFRONT')}
          />
        ) : null;
      case 'CART':
        return (
          <CartView
            cart={cart}
            onRemoveItem={handleRemoveFromCart}
            onGoToCheckout={() => setView('CHECKOUT')}
            onBackToStore={() => setView('STOREFRONT')}
          />
        );
      case 'CHECKOUT':
        return <Checkout cart={cart} onBack={() => setView('CART')} onRestart={restart} />;
      default:
        return <Storefront products={productData} onSelectProduct={handleProductSelect} />;
    }
  }, [view, cart, selectedProduct, handleProductSelect, handleAddToCart, handleRemoveFromCart, restart]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        onRestart={restart} 
        cartItemCount={cartItemCount}
        onCartClick={() => setView('CART')}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {currentViewComponent}
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default App;
