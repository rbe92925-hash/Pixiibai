import React from 'react';
import type { Product } from '../types';
import { AlbumIcon, FrameIcon, GiftCardIcon, MagnetIcon, OrnamentIcon } from './IconComponents';

interface StorefrontProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const getProductIcon = (type: Product['type']) => {
    const iconProps = { className: "w-12 h-12 text-gray-700 group-hover:text-gray-900 transition-colors" };
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
    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transform transition-all duration-300 group flex flex-col"
  >
    <div className="p-8 flex justify-center items-center bg-gray-50 border-b border-gray-200">
        {getProductIcon(product.type)}
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
      <p className="text-gray-600 mt-2 flex-grow">{product.tagline}</p>
      <div className="mt-4">
        <span className="text-lg font-bold text-gray-800">{product.priceText}</span>
      </div>
    </div>
  </div>
);

export const Storefront: React.FC<StorefrontProps> = ({ products, onSelectProduct }) => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Transforma Tus Recuerdos en Arte</h2>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">Elige uno de nuestros productos y empieza a crear algo único con tus fotos favoritas.</p>
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