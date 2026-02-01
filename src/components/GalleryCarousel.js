import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const GalleryCarousel = () => {
  const images = useMemo(
    () => [
      "/gallery/1.jpg",
      "/gallery/2.jpg",
      "/gallery/3.jpg",
      "/gallery/4.jpg",
      "/gallery/5.jpg",
      "/gallery/6.jpg",
      "/gallery/7.jpg",
      "/gallery/8.jpg",
      "/gallery/9.jpg",
      "/gallery/10.jpg",
      "/gallery/11.jpg",
      "/gallery/12.jpg",
    ],
    []
  );

  /* ---------- responsive ---------- */
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const visible = isMobile ? 1 : 3;
  const step = isMobile ? 100 : 34;

  /* ---------- infinite track ---------- */
  const extended = useMemo(() => {
    const head = images.slice(0, visible);
    const tail = images.slice(images.length - visible);
    return [...tail, ...images, ...head];
  }, [images, visible]);

  const [index, setIndex] = useState(visible);
  const [noAnim, setNoAnim] = useState(false);

  const dragX = useMotionValue(0);

  /* ---------- reset on layout change ---------- */
  useEffect(() => {
    setNoAnim(true);
    setIndex(visible);
    dragX.set(0);
    requestAnimationFrame(() => setNoAnim(false));
  }, [visible, dragX]);

  /* ---------- infinite correction ---------- */
  const normalize = () => {
    const first = visible;
    const last = visible + images.length - 1;

    if (index > last) {
      setNoAnim(true);
      setIndex(first);
      dragX.set(0);
      requestAnimationFrame(() => setNoAnim(false));
    }

    if (index < first) {
      setNoAnim(true);
      setIndex(last);
      dragX.set(0);
      requestAnimationFrame(() => setNoAnim(false));
    }
  };

  /* ---------- arrows ---------- */
  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  /* ---------- swipe ---------- */
  const onDragEnd = (_e, info) => {
    if (!isMobile) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    const swipe = Math.abs(offset) * Math.abs(velocity);
    const DIST = 60;
    const POWER = 700;

    if (offset < -DIST || swipe > POWER) next();
    else if (offset > DIST || swipe > POWER) prev();

    animate(dragX, 0, { type: "spring", stiffness: 260, damping: 26 });
  };

  /* ---------- focus slide ---------- */
  const center = isMobile ? index : index + 1;

  return (
    <div className="carousel-wrap">
      <button className="nav-btn left" onClick={prev} aria-label="Previous">
        ‹
      </button>

      <div className="carousel-glass">
        <motion.div
          className="track"
          style={{ x: dragX }}
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={onDragEnd}
          animate={{ x: `-${index * step}%` }}
          transition={
            noAnim
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 22 }
          }
          onAnimationComplete={normalize}
        >
          {extended.map((src, i) => (
            <motion.div
              key={`${src}-${i}`}
              className={`slide ${
                i === center ? "is-center" : "is-side"
              }`}
            >
              <img src={src} alt={`memory-${i + 1}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <button className="nav-btn right" onClick={next} aria-label="Next">
        ›
      </button>
    </div>
  );
};

export default GalleryCarousel;
