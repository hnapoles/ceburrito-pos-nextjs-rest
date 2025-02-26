// pages/grid.tsx
import React from 'react';
import Image from 'next/image';

const images = [
  { src: '/logos/1.png', name: 'Image 1' },
  { src: '/logos/2.png', name: 'Image 2' },
  { src: '/logos/3.png', name: 'Image 3' },
  { src: '/logos/4.png', name: 'Image 4' },
  { src: '/logos/1.png', name: 'Image 1' },
  { src: '/logos/2.png', name: 'Image 2' },
  { src: '/logos/3.png', name: 'Image 3' },
  { src: '/logos/4.png', name: 'Image 4' },
  // Add more images as needed
];

const GridPage: React.FC = () => {
  return (
    <div className="container mx-auto lg:p-4 md:p-2 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image.src}
              alt={image.name}
              layout="responsive"
              width={100}
              height={100}
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center">
              {image.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridPage;
