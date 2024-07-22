import React, { useState, useEffect } from 'react';
import './slider.css';

const images = [
  'img1.jpg',
  'img2.jpg',
  'img3.jpg',
  'img4.jpg'
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slider">
      <div className="slides" style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            key={index}
          >
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      <div className="navigation-manual">
        {images.map((_, index) => (
          <button
            key={index}
            className={`manual-btn ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
