
import React from 'react';
import type { Photo } from '../types';
import { EditIcon, StarIcon, TrashIcon } from './IconComponents';

interface PhotoCardProps {
    photo: Photo;
    isCover: boolean;
    isAlbum: boolean;
    onCaptionChange: (caption: string) => void;
    onDelete: () => void;
    onSetCover: () => void;
    onEdit: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, isCover, isAlbum, onCaptionChange, onDelete, onSetCover, onEdit }) => {
    return (
        <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
            <img src={photo.url} alt="User upload" className="w-full h-40 object-cover"/>
            
            {isCover && isAlbum && (
                 <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                    <StarIcon className="w-3 h-3 mr-1"/> Portada
                </div>
            )}
            
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-700 hover:bg-indigo-600 hover:text-white transition-colors shadow-sm"><EditIcon className="w-4 h-4"/></button>
                {isAlbum && !isCover && <button onClick={onSetCover} className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-700 hover:bg-yellow-400 hover:text-white transition-colors shadow-sm"><StarIcon className="w-4 h-4"/></button>}
                <button onClick={onDelete} className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-700 hover:bg-red-500 hover:text-white transition-colors shadow-sm"><TrashIcon className="w-4 h-4"/></button>
            </div>
            
            <div className="p-3">
                <textarea
                    value={photo.caption}
                    onChange={(e) => onCaptionChange(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="w-full border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none bg-slate-50 focus:bg-white placeholder-slate-400"
                    rows={1}
                />
            </div>
        </div>
    );
};
