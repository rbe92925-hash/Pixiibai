
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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{product.name}</h2>
        <p className="text-lg text-slate-600 mb-8 font-light">{product.tagline}</p>
        
        {product.details.map((section, index) => (
            <div key={index} className="mt-6 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <h4 className="font-semibold text-indigo-700 mb-2">{section.title}</h4>
                <ul className="list-disc list-inside text-slate-600 text-sm space-y-2">
                    {section.points.map((point, pIndex) => <li key={pIndex}>{point}</li>)}
                </ul>
            </div>
        ))}
        <div className="mt-8 flex items-baseline gap-2">
             <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total estimado:</span>
            <p className="text-4xl font-bold text-slate-900">
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
            
            // Logic for finding the exact tier or the highest applicable tier
            const exactTier = sortedTiers.find(tier => quantity === tier.qty);
            
            if (exactTier) {
                tierPrice = exactTier.price;
            } else {
                 // Fallback simple logic if exact quantity isn't a tier: linear pricing based on base
                 // Ideally this should use the highest previous tier logic, but keeping it simple for now based on data structure
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
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Tamaño</h4>
                        <div className="flex flex-wrap gap-2">
                             {product.options.sizes.map(opt => <button key={opt.name} onClick={() => setSelectedSize(opt)} className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${selectedSize?.name === opt.name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{opt.name}</button>)}
                        </div>
                    </div>
                )}
                 {product.options?.covers && (
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Pasta</h4>
                        <div className="flex flex-wrap gap-2">
                             {product.options.covers.map(opt => <button key={opt.name} onClick={() => setSelectedCover(opt)} className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${selectedCover?.name === opt.name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{opt.name}</button>)}
                        </div>
                    </div>
                )}
                 {product.options?.pages && (
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Páginas</h4>
                        <div className="flex flex-wrap gap-2">
                             {product.options.pages.map(opt => <button key={opt.name} onClick={() => setSelectedPages(opt)} className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${selectedPages?.name === opt.name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{opt.name}</button>)}
                        </div>
                    </div>
                )}
                {product.type === 'frame' && (
                    <div className="space-y-6">
                        <div>
                             <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Cantidad</h4>
                             <div className="flex gap-4">
                                {product.options?.tiers?.map(tier => (
                                    <button 
                                        key={tier.qty} 
                                        onClick={() => setQuantity(tier.qty)}
                                        className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 transition-all ${quantity === tier.qty ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-600'}`}
                                    >
                                        <span className="text-xl font-bold">{tier.qty}</span>
                                        <span className="text-xs">Unid.</span>
                                    </button>
                                ))}
                             </div>
                        </div>
                         {product.options?.frame && (
                             <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                 <input type="checkbox" id="addFrame" checked={hasFrame} onChange={e => setHasFrame(e.target.checked)} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                 <label htmlFor="addFrame" className="ml-3 block text-sm font-medium text-slate-700">Añadir marco (+ S/ {product.options.frame.price.toFixed(2)} c/u)</label>
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
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                {renderOptions()}

                <div className="relative border-2 border-dashed border-indigo-100 bg-indigo-50/30 rounded-2xl p-10 text-center group hover:border-indigo-300 hover:bg-indigo-50 transition-all my-8">
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                        <UploadIcon className="h-12 w-12 mb-4" />
                        <p className="text-lg font-medium text-slate-600">Arrastra o selecciona tus fotos</p>
                        <label htmlFor="file-upload" className="mt-4 cursor-pointer bg-white text-indigo-600 border border-indigo-200 font-bold py-2 px-6 rounded-full hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all shadow-sm">
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
                    <button onClick={onBack} className="w-full sm:w-auto text-slate-500 font-bold py-3 px-8 rounded-xl hover:bg-slate-100 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleFinalizeClick} disabled={photos.length === 0} className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:bg-slate-300 disabled:shadow-none">
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

    const amounts = [50, 100, 200];
    const occasions = ['Feliz Cumpleaños', 'Baby Shower', 'Alguien Especial', 'Solo porque sí'];

    return (
       <div className="grid lg:grid-cols-2 gap-12">
            <ProductDetails product={product} calculatedPrice={details.amount} />
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">1. Elige un monto (PEN)</label>
                                <div className="flex flex-wrap gap-2">
                                    {amounts.map(amount => (
                                        <button type="button" key={amount} onClick={() => setDetail('amount', amount)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${details.amount === amount ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                            S/ {amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">2. Ocasión de Regalo</label>
                                 <div className="flex flex-wrap gap-2">
                                    {occasions.map(occ => (
                                        <button type="button" key={occ} onClick={() => setDetail('occasion', occ)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${details.occasion === occ ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                            {occ}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                 <label htmlFor="recipientName" className="block text-sm font-bold text-slate-700 mb-1">Para:</label>
                                 <input type="text" id="recipientName" value={details.recipientName} onChange={e => setDetail('recipientName', e.target.value)} required className="mt-1 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400" placeholder="Nombre del destinatario"/>
                            </div>
                             <div className="mb-4">
                                 <label htmlFor="recipientEmail" className="block text-sm font-bold text-slate-700 mb-1">Email del destinatario:</label>
                                 <input type="email" id="recipientEmail" value={details.recipientEmail} onChange={e => setDetail('recipientEmail', e.target.value)} required className="mt-1 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400" placeholder="email@ejemplo.com"/>
                            </div>
                             <div>
                                 <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-1">Mensaje:</label>
                                 <textarea id="message" value={details.message} onChange={e => setDetail('message', e.target.value)} rows={4} className="mt-1 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400" placeholder="Escribe un mensaje especial..."/>
                            </div>
                        </div>
                    </div>
                     <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end items-center gap-4">
                        <button type="button" onClick={onBack} className="w-full sm:w-auto text-slate-500 font-bold py-3 px-8 rounded-xl hover:bg-slate-100 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
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
