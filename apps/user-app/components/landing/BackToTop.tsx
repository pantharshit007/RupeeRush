import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [showArrow, setShowArrow] = useState(false);

  const handleScroll = () => {
    if (window.scrollY >= 500) {
      setShowArrow(true);
    } else {
      setShowArrow(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Initial check in case page is loaded scrolled down
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-6 z-11 rounded-full bg-blue-500 p-3 text-white shadow-lg
        transition-all duration-300 hover:bg-blue-600 hover:scale-110
        ${showArrow ? "bottom-6" : "-bottom-24"}`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
};

export default BackToTop;
