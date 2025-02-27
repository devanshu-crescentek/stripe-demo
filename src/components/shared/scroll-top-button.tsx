'use client'
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 bg-black text-white shadow-lg transition-opacity duration-300 size-[30px] flex items-center justify-center ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronUp size={20} className='w-[20px] h-[20px]' />
      </button>
  );
};

export default ScrollToTopButton;
