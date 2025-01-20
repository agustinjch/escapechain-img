import React, { useEffect, useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface Image {
  id: string;
  url: string;
  prompt?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    images: Image[];
  };
}

function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://escapechain.onrender.com/v1/image/all');
        const data: ApiResponse = await response.json();
        if (data.success) {
          setImages(data.data.images);
        } else {
          setError('Failed to fetch images');
        }
      } catch (err) {
        setError('Error fetching images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin text-gray-600">
          <ImageIcon size={32} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Image Gallery</h1>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.url}
                alt={`Image ${image.id}`}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <p className="text-gray-700 text-lg capitalize">
                  {image.prompt || 'No prompt available'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-0 right-0 m-4 text-white text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedImage.url}
              alt={`Image ${selectedImage.id}`}
              className="max-w-full max-h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;