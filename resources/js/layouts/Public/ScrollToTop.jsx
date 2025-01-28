import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const toggleVisibility = () => {
      // Don't show on home page when in hero section
      if (isHome && window.scrollY < window.innerHeight) {
        setIsVisible(false);
        return;
      }

      // Show button when page is scrolled more than 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [isHome]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50"
          aria-label="Volver al inicio de la página"
          role="button"
        >
          <ArrowUpIcon className="w-6 h-6" aria-hidden="true" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;