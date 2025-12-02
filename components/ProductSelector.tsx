
import React from 'react';
import type { Product } from '../types';
import { AlbumIcon, FrameIcon, GiftCardIcon, MagnetIcon, OrnamentIcon } from './IconComponents';

interface StorefrontProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const getProductIcon = (type: Product['type']) => {
    const iconProps = { className: "w-12 h-12 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" };
    switch (type) {
        case 'album': return <AlbumIcon {...iconProps} />;
        case 'magnets': return <MagnetIcon {...iconProps} />;
        case 'frame': return <FrameIcon {...iconProps} />;
        case 'ornaments': return <OrnamentIcon {...iconProps} />;
        case 'giftcard': return <GiftCardIcon {...iconProps} />;
        default: return null;
    }
}

const ProductCard: React.FC<{
  product: Product;
  onClick: () => void;
}> = ({ product, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 border border-slate-100 overflow-hidden cursor-pointer hover:-translate-y-1 transform transition-all duration-300 group flex flex-col"
  >
    <div className="p-8 flex justify-center items-center bg-slate-50/50 group-hover:bg-indigo-50/30 transition-colors duration-300">
        <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
             {getProductIcon(product.type)}
        </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{product.name}</h3>
      <p className="text-slate-500 mt-2 flex-grow text-sm leading-relaxed">{product.tagline}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">{product.priceText}</span>
        <span className="text-indigo-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">Crear ahora &rarr;</span>
      </div>
    </div>
  </div>
);

export const Storefront: React.FC<StorefrontProps> = ({ products, onSelectProduct }) => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">Transforma Tus Recuerdos</h2>
      <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto font-light">
        Elige uno de nuestros productos premium y crea algo único con tus fotos favoritas.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onSelectProduct(product)}
          />
        ))}
      </div>
    </div>
  );
};
