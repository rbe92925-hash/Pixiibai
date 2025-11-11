import React, { useState, useCallback } from 'react';
import type { Photo } from '../types';
import { editImageWithGemini } from '../services/geminiService';
import { WandIcon, XIcon } from './IconComponents';

interface ImageEditorModalProps {
  photo: Photo;
  onClose: () => void;
  onSave: (updatedPhoto: Photo) => void;
}

// Helper to convert data URL to File object
async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const newFileName = fileName.substring(0, fileName.lastIndexOf('.')) + `-${Date.now()}.` + (blob.type.split('/')[1] || 'png');
  return new File([blob], newFileName, { type: blob.type });
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ photo, onClose, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Por favor, introduce una instrucción.');
      return;
    }
    setIsLoading(true);
    setError(null);
    
    const result = await editImageWithGemini(photo.file, prompt);
    
    setIsLoading(false);
    if (result) {
      setEditedImageUrl(result);
    } else {
      setError('No se pudo editar la imagen. Inténtalo de nuevo con otras instrucciones.');
    }
  }, [prompt, photo.file]);

  const handleSave = useCallback(async () => {
    if (!editedImageUrl) return;

    const newFile = await dataUrlToFile(editedImageUrl, photo.file.name);
    onSave({
      ...photo,
      url: editedImageUrl,
      file: newFile,
    });
  }, [editedImageUrl, photo, onSave]);
  
  const examplePrompts = [
    "Añade un filtro retro",
    "Haz que el cielo sea más azul",
    "Conviértelo en blanco y negro",
    "Añade un efecto de ensueño",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <WandIcon className="w-6 h-6 mr-2 text-gray-800" />
            Editar foto con IA
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Cerrar">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 relative min-h-[300px]">
                {isLoading && (
                     <div className="absolute inset-0 bg-white/70 flex flex-col justify-center items-center z-10 rounded-lg">
                        <svg className="animate-spin h-8 w-8 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-gray-600 font-semibold">Aplicando magia...</p>
                    </div>
                )}
                <img 
                    src={editedImageUrl || photo.url} 
                    alt="Photo to edit" 
                    className="max-w-full max-h-[50vh] object-contain rounded-md"
                />
                 {editedImageUrl && !isLoading && (
                    <button
                        onClick={() => setEditedImageUrl(null)}
                        className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm text-sm text-gray-800 py-1 px-3 rounded-full hover:bg-white transition-colors"
                    >
                        Restaurar original
                    </button>
                )}
            </div>

            <div className="flex flex-col">
                 <h4 className="font-semibold text-gray-700 mb-2">¿Qué quieres cambiar?</h4>
                 <p className="text-sm text-gray-500 mb-4">Describe la edición que quieres hacer. ¡Sé creativo!</p>
                 <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Quita a la persona del fondo y haz que parezca un día soleado..."
                    className="w-full border-gray-300 rounded-md p-2 text-sm focus:ring-gray-800 focus:border-gray-800 transition mb-4"
                    rows={3}
                    disabled={isLoading}
                 />
                 <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">O prueba un ejemplo:</p>
                    <div className="flex flex-wrap gap-2">
                        {examplePrompts.map(p => (
                            <button key={p} onClick={() => setPrompt(p)} disabled={isLoading} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50">{p}</button>
                        ))}
                    </div>
                 </div>
                 <button
                    onClick={handleEdit}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full flex items-center justify-center bg-gray-800 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                 >
                    Generar Edición
                 </button>
                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </div>

        <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg sticky bottom-0 z-10">
            <button onClick={onClose} className="text-gray-600 bg-white border border-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors mr-3">
                Cancelar
            </button>
            <button
                onClick={handleSave}
                disabled={!editedImageUrl || isLoading}
                className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            >
                Guardar Cambios
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-scale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};