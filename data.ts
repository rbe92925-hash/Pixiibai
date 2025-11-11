import type { Product } from './types';

export const products: Product[] = [
  {
    id: 'fotolibro',
    type: 'album',
    name: 'Fotolibros',
    tagline: 'Tus mejores recuerdos en un álbum impreso.',
    details: [
        { title: 'Tipos de fotolibros', points: ['Precio: 345 - 830 PEN', 'Tamaño: 16x16 cm / 21x21 cm', 'Pastas: Duro / Blando', 'Interiores: pañal de 150 g', 'Páginas: 60 / 80 / 100', 'Envío: 7 a 10 días hábiles'] }
    ],
    priceText: 'Desde S/ 345.00',
    basePrice: 345,
    options: {
        sizes: [{ name: '16x16 cm', price: 0 }, { name: '21x21 cm', price: 100 }],
        covers: [{ name: 'Blando', price: 0 }, { name: 'Duro', price: 50 }],
        pages: [{ name: '60', price: 0 }, { name: '80', price: 150 }, { name: '100', price: 335 }]
    }
  },
  {
    id: 'imanes',
    type: 'magnets',
    name: 'Imanes',
    tagline: 'Tus recuerdos en todo lugar.',
    details: [
        { title: 'Detalles', points: ['El detalle perfecto para tu refri u oficina o después de un viaje o evento.'] },
        { title: 'Especificaciones', points: ['Paquete de 15 imanes', 'Medidas: 7 x 7 cm', 'Imán calibre 30'] }
    ],
    priceText: 'S/ 199.00',
    basePrice: 199,
  },
  {
    id: 'cuadros',
    type: 'frame',
    name: 'Cuadros',
    tagline: 'Transforma tus recuerdos en arte para tu pared.',
    details: [
        { title: 'Características', points: ['Impresión en papel fotográfico, montado sobre foamboard', 'Tamaño 21x21x1.5 cm', 'Con cinta lista para pegarse en cualquier superficie lisa', 'Se pega y despega sin dejar residuos.'] },
        { title: 'Costo', points: ['1 cuadro 349 PEN', '2 cuadros 599 PEN', '3 cuadros 799 PEN', 'Después del 3er Pixycuadro, 299 PEN por cuadro adicional.', 'Más 170 PEN con marco por Pixycuadro.']}
    ],
    priceText: 'Desde S/ 349.00',
    basePrice: 349,
    options: {
        frame: { price: 170 },
        tiers: [
            { qty: 1, price: 349 },
            { qty: 2, price: 599 },
            { qty: 3, price: 799 },
        ]
    }
  },
   {
    id: 'esferas',
    type: 'ornaments',
    name: 'Esferas',
    tagline: 'Tus fotos favoritas para decorar esta Navidad.',
    details: [
        { title: 'Detalles', points: ['Fotos montadas en acrílico en forma de esfera.'] },
        { title: 'Especificaciones', points: ['Paquete con 10 piezas', 'Dimensiones: 8 cm x 4 mm'] }
    ],
    priceText: 'S/ 599.00',
    basePrice: 599,
  },
  {
    id: 'tarjeta-regalo',
    type: 'giftcard',
    name: 'Tarjeta de Regalo',
    tagline: 'Regala a alguien especial crédito para cualquier producto.',
    details: [
        { title: 'Cómo funciona', points: ['Elige un monto.', 'Se enviará una tarjeta digital por correo electrónico.', 'En tarjetas de regalo no aplican cupones de descuento.'] }
    ],
    priceText: 'Elige un monto',
  }
];