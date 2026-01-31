import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const GalleryCarousel = () => {
  // Images (public paths)
  const images = useMemo(
    () => [
      "/gallery/1.jpg",
      "/gallery/2.jpg",
      "/gallery/3.jpg",
      "/gallery/4.jpg",
      "/gallery/5.jpg",
      "/gallery/6.jpg",
    ],
    []
  );

  /* ---------- responsive state ---------- */
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ---------- carousel config ---------- */
  const visible = isMobile ? 1 : 3;
  const step = isMobile ? 100 : 34;

  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, images.length - visible);

  // Clamp index when screen size changes
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  /* ---------- navigation ---------- */
  const goLeft = () => setIndex((i) => Math.max(0, i - 1));
  const goRight = () => setIndex((i) => Math.min(maxIndex, i + 1));

  /* ---------- render ---------- */
  return (
    <div className="carousel-wrap">
      <button
        className="nav-btn left"
        onClick={goLeft}
        disabled={index === 0}
        aria-label="Previous images"
      >
        ‹
      </button>

      <div className="carousel-glass">
        <motion.div
          className="track"
          animate={{ x: `-${index * step}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        >
          {images.map((src, i) => (
            <motion.div
              className="slide"
              key={src}
              whileHover={!isMobile ? { scale: 1.02 } : undefined}
              transition={{ duration: 0.2 }}
            >
              <img src={src} alt={`memory-${i + 1}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <button
        className="nav-btn right"
        onClick={goRight}
        disabled={index === maxIndex}
        aria-label="Next images"
      >
        ›
      </button>
    </div>
  );
};

export default GalleryCarousel;
