
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-slate-800 flex items-center">
            <WandIcon className="w-5 h-5 mr-2 text-indigo-600" />
            Editar con IA
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Cerrar">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
            <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 relative min-h-[300px] border border-slate-100">
                {isLoading && (
                     <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-xl">
                        <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-indigo-900 font-semibold">Aplicando magia...</p>
                    </div>
                )}
                <img 
                    src={editedImageUrl || photo.url} 
                    alt="Photo to edit" 
                    className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-sm"
                />
                 {editedImageUrl && !isLoading && (
                    <button
                        onClick={() => setEditedImageUrl(null)}
                        className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-full hover:bg-white shadow-sm transition-colors"
                    >
                        Restaurar original
                    </button>
                )}
            </div>

            <div className="flex flex-col">
                 <h4 className="font-bold text-slate-800 mb-2">¿Qué quieres cambiar?</h4>
                 <p className="text-sm text-slate-500 mb-4">Describe la edición que quieres hacer. ¡Sé creativo!</p>
                 <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Quita a la persona del fondo y haz que parezca un día soleado..."
                    className="w-full border-slate-300 rounded-lg p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition mb-4 shadow-sm"
                    rows={3}
                    disabled={isLoading}
                 />
                 <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Sugerencias:</p>
                    <div className="flex flex-wrap gap-2">
                        {examplePrompts.map(p => (
                            <button key={p} onClick={() => setPrompt(p)} disabled={isLoading} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50 font-medium">{p}</button>
                        ))}
                    </div>
                 </div>
                 <button
                    onClick={handleEdit}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-slate-300 shadow-lg shadow-indigo-200 disabled:shadow-none"
                 >
                    <WandIcon className="w-4 h-4 mr-2" />
                    Generar Edición
                 </button>
                 {error && <p className="text-red-500 text-sm mt-3 bg-red-50 p-2 rounded-lg">{error}</p>}
            </div>
        </div>

        <div className="flex justify-end items-center p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl sticky bottom-0 z-10">
            <button onClick={onClose} className="text-slate-600 bg-white border border-slate-200 font-semibold py-2 px-6 rounded-xl hover:bg-slate-50 transition-colors mr-3">
                Cancelar
            </button>
            <button
                onClick={handleSave}
                disabled={!editedImageUrl || isLoading}
                className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-slate-300 shadow-md disabled:shadow-none"
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
