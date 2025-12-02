
import type { Product } from './types';

export const products: Product[] = [
  {
    id: 'fotolibro',
    type: 'album',
    name: 'Fotolibros',
    tagline: 'Tus mejores recuerdos en un álbum impreso.',
    details: [
        { title: 'Tipos de fotolibros', points: ['Precio: 89 - 220 PEN', 'Tamaño: 16x16 cm / 21x21 cm', 'Pastas: Duro / Blando', 'Interiores: papel couché 150g', 'Páginas: 60 / 80 / 100', 'Envío: 7 a 10 días hábiles'] }
    ],
    priceText: 'Desde S/ 89.00',
    basePrice: 89,
    options: {
        sizes: [{ name: '16x16 cm', price: 0 }, { name: '21x21 cm', price: 40 }],
        covers: [{ name: 'Blando', price: 0 }, { name: 'Duro', price: 25 }],
        pages: [{ name: '60', price: 0 }, { name: '80', price: 30 }, { name: '100', price: 50 }]
    }
  },
  {
    id: 'imanes',
    type: 'magnets',
    name: 'Imanes',
    tagline: 'Tus recuerdos en todo lugar.',
    details: [
        { title: 'Detalles', points: ['El detalle perfecto para tu refri u oficina o después de un viaje o evento.'] },
        { title: 'Especificaciones', points: ['Paquete de 15 imanes', 'Medidas: 7 x 7 cm', 'Imán flexible de alta calidad'] }
    ],
    priceText: 'S/ 49.00',
    basePrice: 49,
  },
  {
    id: 'cuadros',
    type: 'frame',
    name: 'PixyCuadros',
    tagline: 'Transforma tus recuerdos en arte para tu pared.',
    details: [
        { title: 'Características', points: ['Impresión en papel fotográfico mate', 'Montado sobre foamboard ligero', 'Tamaño 21x21 cm', 'Incluye cinta adhesiva doble contacto', 'Se pega y despega sin dañar la pared.'] },
        { title: 'Costo', points: ['1 cuadro 45 PEN', '3 cuadros 120 PEN', '6 cuadros 220 PEN', 'Marco adicional: +20 PEN por cuadro.']}
    ],
    priceText: 'Desde S/ 45.00',
    basePrice: 45,
    options: {
        frame: { price: 20 },
        tiers: [
            { qty: 1, price: 45 },
            { qty: 3, price: 120 },
            { qty: 6, price: 220 },
        ]
    }
  },
   {
    id: 'esferas',
    type: 'ornaments',
    name: 'Esferas Navideñas',
    tagline: 'Tus fotos favoritas para decorar el árbol.',
    details: [
        { title: 'Detalles', points: ['Fotos encapsuladas en acrílico transparente.'] },
        { title: 'Especificaciones', points: ['Paquete con 6 piezas', 'Dimensiones: 7 cm diámetro', 'Incluye cinta decorativa'] }
    ],
    priceText: 'S/ 59.00',
    basePrice: 59,
  },
  {
    id: 'tarjeta-regalo',
    type: 'giftcard',
    name: 'Tarjeta de Regalo',
    tagline: 'Regala a alguien especial crédito para cualquier producto.',
    details: [
        { title: 'Cómo funciona', points: ['Elige un monto.', 'Se enviará una tarjeta digital por correo electrónico.', 'Válido por 12 meses.'] }
    ],
    priceText: 'Elige un monto',
  }
];
