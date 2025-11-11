import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-transparent mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Pixibai. Todos los derechos reservados.</p>
                <p className="text-sm">Un proyecto por estudiantes del colegio san carlos.</p>
                <p className="mt-2 text-xs">Hecho con ❤️ en Perú</p>
            </div>
        </footer>
    );
};