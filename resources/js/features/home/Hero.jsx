import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';

// Datos estáticos para reducir el JavaScript inicial
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

// Componente para el fondo optimizado
const SlideBackground = memo(({ gradient, isActive }) => (
  <div
    className={`absolute inset-0 transition-opacity duration-500 ${
      isActive ? 'opacity-100' : 'opacity-0'
    }`}
    aria-hidden="true"
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`} />
    <div className="absolute inset-0 bg-black/30" />
  </div>
));

// Componente para el contenido del slide
const SlideContent = memo(({ slide, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
        {slide.title}
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90">
        {slide.description}
      </p>
    </div>
  );
});

// Botón de navegación optimizado
const NavButton = memo(({ index, currentSlide, onClick, total }) => (
  <button
    className="w-12 h-12 flex items-center justify-center"
    onClick={() => onClick(index)}
    aria-label={`Ir a diapositiva ${index + 1} de ${total}`}
    aria-current={currentSlide === index}
  >
    <span
      className={`block h-2 rounded-full transition-all duration-300 ${
        currentSlide === index
          ? "bg-white w-8"
          : "bg-white/50 hover:bg-white/70 w-2"
      }`}
    />
  </button>
));

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Optimizado con useCallback para evitar re-renders innecesarios
  const handleSlideChange = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // UseInterval personalizado para el autoplay
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Backgrounds */}
      {slides.map((slide, index) => (
        <SlideBackground
          key={`bg-${index}`}
          gradient={slide.gradient}
          isActive={index === currentSlide}
        />
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-24 px-4 sm:px-6 lg:px-8">
        {slides.map((slide, index) => (
          <SlideContent
            key={`content-${index}`}
            slide={slide}
            isActive={index === currentSlide}
          />
        ))}

        {/* CTA - Fuera del loop para evitar re-renders */}
        <Link
          to="/servicios"
          className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white w-fit"
        >
          Comenzar ahora
        </Link>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-10">
        {slides.map((_, index) => (
          <NavButton
            key={`nav-${index}`}
            index={index}
            currentSlide={currentSlide}
            onClick={handleSlideChange}
            total={slides.length}
          />
        ))}
      </div>

      {/* Live region para lectores de pantalla */}
      <div className="sr-only" aria-live="polite">
        Diapositiva {currentSlide + 1} de {slides.length}: {slides[currentSlide].title}
      </div>
    </section>
  );
};

export default memo(Hero);