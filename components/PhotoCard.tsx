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
        <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
            <img src={photo.url} alt="User upload" className="w-full h-40 object-cover"/>
            
            {isCover && isAlbum && (
                 <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <StarIcon className="w-4 h-4 mr-1"/> Portada
                </div>
            )}
            
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"><EditIcon className="w-5 h-5"/></button>
                {isAlbum && !isCover && <button onClick={onSetCover} className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"><StarIcon className="w-5 h-5"/></button>}
                <button onClick={onDelete} className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:bg-red-500 hover:text-white transition-colors"><TrashIcon className="w-5 h-5"/></button>
            </div>
            
            <div className="p-2">
                <textarea
                    value={photo.caption}
                    onChange={(e) => onCaptionChange(e.target.value)}
                    placeholder="Comentario..."
                    className="w-full border-gray-300 rounded-md p-2 text-sm focus:ring-gray-800 focus:border-gray-800 transition resize-none"
                    rows={1}
                />
            </div>
        </div>
    );
};