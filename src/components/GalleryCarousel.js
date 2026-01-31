import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const GalleryCarousel = () => {
  // Add/remove images here (public paths)
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

  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, images.length - 3);

  const goLeft = () => setIndex((i) => Math.max(0, i - 1));
  const goRight = () => setIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <div className="carousel-wrap">
      <button className="nav-btn left" onClick={goLeft} disabled={index === 0} aria-label="Previous images">
        ‹
      </button>

      <div className="carousel-glass">
        <motion.div
          className="track"
          animate={{ x: `-${index * 34}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {images.map((src, i) => (
            <motion.div
              className="slide"
              key={src}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img src={src} alt={`memory-${i + 1}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <button className="nav-btn right" onClick={goRight} disabled={index === maxIndex} aria-label="Next images">
        ›
      </button>
    </div>
  );
};

export default GalleryCarousel;
