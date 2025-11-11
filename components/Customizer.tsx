import React, { useState, useCallback, useMemo } from 'react';
import type { Photo, Product, CartItem, GiftCardDetails, ProductOption, SelectedOptions } from '../types';
import { PhotoCard } from './PhotoCard';
import { ImageEditorModal } from './ImageEditorModal';
import { UploadIcon, GiftCardIcon } from './IconComponents';

interface ProductCustomizerProps {
  product: Product;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onBack: () => void;
}

const ProductDetails: React.FC<{ product: Product, calculatedPrice?: number }> = ({ product, calculatedPrice }) => (
    <div className="lg:pr-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{product.name}</h2>
        <p className="text-lg text-gray-600 mt-2 mb-6">{product.tagline}</p>
        
        {product.details.map((section, index) => (
            <div key={index} className="mt-4">
                <h4 className="font-semibold text-gray-800">{section.title}</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
                    {section.points.map((point, pIndex) => <li key={pIndex}>{point}</li>)}
                </ul>
            </div>
        ))}
        <div className="mt-8">
            <p className="text-3xl font-bold text-gray-900">
                {calculatedPrice !== undefined ? `S/ ${calculatedPrice.toFixed(2)}` : product.priceText}
            </p>
        </div>
    </div>
);


const PhotoBasedCustomizer: React.FC<Omit<ProductCustomizerProps, 'onAddToCart'> & {onFinalize: (photos: Photo[], price: number, description?: string, options?: SelectedOptions) => void}> = ({ product, onBack, onFinalize }) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [coverPhotoId, setCoverPhotoId] = useState<string | null>(null);
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    
    // State for options
    const [selectedSize, setSelectedSize] = useState<ProductOption | undefined>(product.options?.sizes?.[0]);
    const [selectedCover, setSelectedCover] = useState<ProductOption | undefined>(product.options?.covers?.[0]);
    const [selectedPages, setSelectedPages] = useState<ProductOption | undefined>(product.options?.pages?.[0]);
    const [quantity, setQuantity] = useState(1);
    const [hasFrame, setHasFrame] = useState(false);
    
    const calculatedPrice = useMemo(() => {
        let price = product.basePrice || 0;
        if (product.type === 'album') {
            price += selectedSize?.price || 0;
            price += selectedCover?.price || 0;
            price += selectedPages?.price || 0;
        } else if (product.type === 'frame') {
            let tierPrice = product.basePrice || 0;
            const sortedTiers = product.options?.tiers?.sort((a,b) => a.qty - b.qty) || [];
            const applicableTier = sortedTiers.find(tier => quantity === tier.qty);

            if (applicableTier) {
                tierPrice = applicableTier.price;
            } else if (quantity > (sortedTiers.at(-1)?.qty || 0)) {
                const baseTier = sortedTiers.at(-1)!;
                const additionalQty = quantity - baseTier.qty;
                const additionalPrice = (product.options?.tiers?.at(-1)?.price || baseTier.price/baseTier.qty) - 50; // 299 per additional
                tierPrice = baseTier.price + (additionalQty * additionalPrice);
            } else {
                 tierPrice = (product.basePrice || 0) * quantity;
            }
           
            price = tierPrice;
            if(hasFrame) price += (product.options?.frame?.price || 0) * quantity;
        }
        return price;
    }, [product, selectedSize, selectedCover, selectedPages, quantity, hasFrame]);
    
    const optionDescription = useMemo(() => {
         if (product.type === 'album') {
             return `${selectedSize?.name}, ${selectedCover?.name}, ${selectedPages?.name} Pags.`;
         }
         if (product.type === 'frame') {
             return `${quantity} cuadro${quantity > 1 ? 's' : ''}${hasFrame ? ', con marco' : ''}`;
         }
         return undefined;
    }, [product.type, selectedSize, selectedCover, selectedPages, quantity, hasFrame]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const newPhotos: Photo[] = files.map((file: File) => ({
                id: crypto.randomUUID(),
                url: URL.createObjectURL(file),
                file: file,
                caption: '',
                date: new Date().toLocaleDateString('es-PE'),
            }));
            setPhotos(prev => [...prev, ...newPhotos]);
            if(product.type === 'album' && !coverPhotoId && newPhotos.length > 0) {
                setCoverPhotoId(newPhotos[0].id)
            }
        }
    }, [product.type, coverPhotoId]);

    const handlePhotoUpdate = useCallback((updatedPhoto: Photo) => {
        setPhotos(prev => prev.map(p => (p.id === updatedPhoto.id ? updatedPhoto : p)));
    }, []);

    const handlePhotoDelete = useCallback((photoId: string) => {
        setPhotos(prev => {
            const remaining = prev.filter(p => p.id !== photoId);
            if (coverPhotoId === photoId) {
                setCoverPhotoId(remaining.length > 0 ? remaining[0].id : null);
            }
            return remaining;
        });
    }, [coverPhotoId]);

    const handleEditComplete = (updatedPhoto: Photo) => {
        handlePhotoUpdate(updatedPhoto);
        setEditingPhoto(null);
    };

    const handleFinalizeClick = () => {
        const selectedOptions: SelectedOptions = {};
        if (product.type === 'album') {
            selectedOptions.size = selectedSize?.name;
            selectedOptions.cover = selectedCover?.name;
            selectedOptions.pages = parseInt(selectedPages?.name || '0');
        }
        if (product.type === 'frame') {
            selectedOptions.hasFrame = hasFrame;
        }
        onFinalize(photos, calculatedPrice, optionDescription, selectedOptions);
    }
    
    const renderOptions = () => {
        return(
            <div className="space-y-6">
                {product.options?.sizes && (
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Tamaño</h4>
                        <div className="flex flex-wrap gap-2">
                             {product.options.sizes.map(opt => <button key={opt.name} onClick={() => setSelectedSize(opt)} className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${selectedSize?.name === opt.name ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{opt.name}</button>)}
                        </div>
                    </div>
                )}
                 {product.options?.covers && (
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Pasta</h4>
                        <div className="flex flex-wrap gap-2">
                             {product.options.covers.map(opt => <button key={opt.name} onClick={() => setSelectedCover(opt)} className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${selectedCover?.name === opt.name ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{opt.name}</button>)}
                        </div>
                    </div>
                )}
                 {product.options?.pages && (
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Páginas</h4>
                        <div className="flex flex-wrap gap-2">
                             {product.options.pages.map(opt => <button key={opt.name} onClick={() => setSelectedPages(opt)} className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${selectedPages?.name === opt.name ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{opt.name}</button>)}
                        </div>
                    </div>
                )}
                {product.type === 'frame' && (
                    <div className="space-y-4">
                        <div>
                             <h4 className="font-semibold text-gray-800 mb-2">Cantidad</h4>
                             <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)))} className="w-24 border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800" />
                        </div>
                         {product.options?.frame && (
                             <div className="flex items-center">
                                 <input type="checkbox" id="addFrame" checked={hasFrame} onChange={e => setHasFrame(e.target.checked)} className="h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-700" />
                                 <label htmlFor="addFrame" className="ml-2 block text-sm text-gray-800">Añadir marco (+ S/ {product.options.frame.price.toFixed(2)} c/u)</label>
                             </div>
                         )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="grid lg:grid-cols-2 gap-12">
            <ProductDetails product={product} calculatedPrice={calculatedPrice}/>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                {renderOptions()}

                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-10 text-center group hover:border-gray-800 transition-colors my-8">
                    <div className="flex flex-col items-center text-gray-500 group-hover:text-gray-800 transition-colors">
                        <UploadIcon className="h-12 w-12 mb-4" />
                        <p className="text-lg font-semibold">Arrastra o selecciona tus fotos</p>
                        <label htmlFor="file-upload" className="mt-4 cursor-pointer bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-900 transition-colors">
                            {photos.length > 0 ? 'Añadir más fotos' : 'Elegir desde dispositivo'}
                        </label>
                    </div>
                    <input id="file-upload" type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange}/>
                </div>

                 {photos.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {photos.map(photo => (
                        <PhotoCard
                            key={photo.id}
                            photo={photo}
                            isCover={photo.id === coverPhotoId}
                            isAlbum={product.type === 'album'}
                            onCaptionChange={caption => handlePhotoUpdate({ ...photo, caption })}
                            onDelete={() => handlePhotoDelete(photo.id)}
                            onSetCover={() => setCoverPhotoId(photo.id)}
                            onEdit={() => setEditingPhoto(photo)}
                        />
                        ))}
                    </div>
                )}
                
                <div className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-4">
                    <button onClick={onBack} className="w-full sm:w-auto bg-white border border-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleFinalizeClick} disabled={photos.length === 0} className="w-full sm:w-auto bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400">
                        Añadir al carrito
                    </button>
                </div>
            </div>
             {editingPhoto && <ImageEditorModal photo={editingPhoto} onClose={() => setEditingPhoto(null)} onSave={handleEditComplete}/>}
        </div>
    );
}

const GiftCardCustomizer: React.FC<Omit<ProductCustomizerProps, 'onAddToCart'> & {onFinalize: (details: GiftCardDetails) => void}> = ({ product, onBack, onFinalize }) => {
    const [details, setDetails] = useState<GiftCardDetails>({
        amount: 50, occasion: 'Feliz Cumpleaños', recipientName: '', recipientEmail: '', message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFinalize(details);
    }

    const setDetail = (key: keyof GiftCardDetails, value: any) => {
        setDetails(prev => ({...prev, [key]: value}));
    }

    const amounts = [50, 100, 200, 500];
    const occasions = ['Feliz Cumpleaños', 'Baby Shower', 'Alguien Especial', 'Solo porque sí'];

    return (
       <div className="grid lg:grid-cols-2 gap-12">
            <ProductDetails product={product} calculatedPrice={details.amount} />
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">1. Elige un monto (PEN)</label>
                                <div className="flex flex-wrap gap-2">
                                    {amounts.map(amount => (
                                        <button type="button" key={amount} onClick={() => setDetail('amount', amount)} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${details.amount === amount ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                            S/ {amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">2. Ocasión de Regalo</label>
                                 <div className="flex flex-wrap gap-2">
                                    {occasions.map(occ => (
                                        <button type="button" key={occ} onClick={() => setDetail('occasion', occ)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${details.occasion === occ ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                            {occ}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                 <label htmlFor="recipientName" className="block text-sm font-bold text-gray-700 mb-1">Para:</label>
                                 <input type="text" id="recipientName" value={details.recipientName} onChange={e => setDetail('recipientName', e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800" placeholder="Nombre del destinatario"/>
                            </div>
                             <div className="mb-4">
                                 <label htmlFor="recipientEmail" className="block text-sm font-bold text-gray-700 mb-1">Email del destinatario:</label>
                                 <input type="email" id="recipientEmail" value={details.recipientEmail} onChange={e => setDetail('recipientEmail', e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800" placeholder="email@ejemplo.com"/>
                            </div>
                             <div>
                                 <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-1">Mensaje:</label>
                                 <textarea id="message" value={details.message} onChange={e => setDetail('message', e.target.value)} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800" placeholder="Escribe un mensaje especial..."/>
                            </div>
                        </div>
                    </div>
                     <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-end items-center gap-4">
                        <button type="button" onClick={onBack} className="w-full sm:w-auto bg-white border border-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors">
                            <GiftCardIcon className="w-5 h-5"/>
                            Añadir al carrito
                        </button>
                    </div>
                </form>
             </div>
        </div>
    )
}


export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ product, onAddToCart, onBack }) => {
    
    const handleFinalizePhotos = (photos: Photo[], price: number, description?: string, options?: SelectedOptions) => {
        onAddToCart({
            product: product,
            quantity: product.type === 'frame' ? photos.length : 1,
            photos: photos,
            price: price,
            description: description,
            selectedOptions: options
        })
    };
    
    const handleFinalizeGiftCard = (details: GiftCardDetails) => {
        onAddToCart({
            product: product,
            quantity: 1,
            giftCardDetails: details,
            price: details.amount,
            description: `Para: ${details.recipientName}`
        })
    }

  if (product.type === 'giftcard') {
    return <GiftCardCustomizer product={product} onBack={onBack} onFinalize={handleFinalizeGiftCard} />
  } else {
    return <PhotoBasedCustomizer product={product} onBack={onBack} onFinalize={handleFinalizePhotos} />
  }
};