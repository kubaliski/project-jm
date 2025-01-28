import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: "Soluciones Empresariales",
    description: "Herramientas poderosas para hacer crecer tu negocio",
    gradient: "from-blue-600 to-purple-600"
  },
  {
    title: "Análisis de Datos",
    description: "Transforma tus datos en información valiosa",
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    title: "Infraestructura Cloud",
    description: "Soluciones en la nube seguras y escalables",
    gradient: "from-indigo-600 to-blue-600"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(slides.length - 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevSlide(currentSlide);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleSlideChange = (index) => {
    if (index !== currentSlide) {
      setPrevSlide(currentSlide);
      setCurrentSlide(index);
    }
  };

  return (
    <section
      className="relative h-screen overflow-hidden"
      aria-labelledby="hero-heading"
      role="region"
      aria-roledescription="carousel"
    >
      {/* Background layers */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 z-20'
              : index === prevSlide
                ? 'opacity-0 z-10'
                : 'opacity-0 z-0'
          }`}
          aria-hidden={currentSlide !== index}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Content layers - Ajustado para posición inferior izquierda */}
      {slides.map((slide, index) => (
        <div
          key={`content-${index}`}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentSlide
              ? 'opacity-100 translate-y-0 z-30'
              : 'opacity-0 translate-y-4 z-0'
          }`}
          aria-hidden={currentSlide !== index}
        >
          <div className="relative h-full flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl mb-16">
              <h1
                id={`slide-title-${index}`}
                className="text-5xl md:text-6xl font-bold mb-6 tracking-tight transform transition-transform text-white"
              >
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                {slide.description}
              </p>
              <Link
                to="/servicios"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
                role="button"
              >
                Comenzar ahora
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators - Ajustado el margen inferior */}
      <div
        className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-40"
        role="tablist"
        aria-label="Navegación de diapositivas"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => handleSlideChange(index)}
            aria-label={`Ir a diapositiva ${index + 1}`}
            aria-selected={currentSlide === index}
            role="tab"
            aria-controls={`slide-title-${index}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;