import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const SurpriseGate = ({ onYes }) => {
  const cardRef = useRef(null);
  const arenaRef = useRef(null);
  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);

  const [yesScale, setYesScale] = useState(1);
  const [noPos, setNoPos] = useState({ x: 12, y: 70 });

  // YES grows when clicking anywhere except YES
  useEffect(() => {
    const handleDocClick = (e) => {
      if (yesBtnRef.current && yesBtnRef.current.contains(e.target)) return;
      setYesScale((s) => clamp(s + 0.08, 1, 1.9));
    };

    document.addEventListener("click", handleDocClick, true);
    return () => document.removeEventListener("click", handleDocClick, true);
  }, []);

  const getBounds = () => {
    const arena = arenaRef.current;
    const noBtn = noBtnRef.current;
    if (!arena || !noBtn) return null;

    const a = arena.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();

    const padding = 10;

    const maxX = Math.max(padding, a.width - b.width - padding);
    const maxY = Math.max(padding, a.height - b.height - padding);

    return { padding, maxX, maxY, arenaRect: a };
  };

  const randomPosFarFromPointer = (clientX, clientY) => {
    const bounds = getBounds();
    if (!bounds) return;

    const { padding, maxX, maxY, arenaRect } = bounds;

    // pointer relative to arena
    const px = clientX - arenaRect.left;
    const py = clientY - arenaRect.top;

    // Choose a position on the opposite side (and add randomness)
    const baseX = px < arenaRect.width / 2 ? maxX : padding;
    const baseY = py < arenaRect.height / 2 ? maxY : padding;

    const jitterX = (Math.random() - 0.5) * 50;
    const jitterY = (Math.random() - 0.5) * 40;

    const x = clamp(baseX + jitterX, padding, maxX);
    const y = clamp(baseY + jitterY, padding, maxY);

    setNoPos({ x, y });
  };

  // Move "No" when pointer gets close (not only when hovering on it)
  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    const onMove = (e) => {
      const bounds = getBounds();
      const noBtn = noBtnRef.current;
      if (!bounds || !noBtn) return;

      const { arenaRect } = bounds;
      const noRect = noBtn.getBoundingClientRect();

      const cx = e.clientX;
      const cy = e.clientY;

      // distance from pointer to center of "No"
      const nx = noRect.left + noRect.width / 2;
      const ny = noRect.top + noRect.height / 2;

      const dx = cx - nx;
      const dy = cy - ny;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Trigger when pointer is within this radius
      const triggerRadius = 90;

      // Only move if pointer is inside arena AND close enough
      const insideArena =
        cx >= arenaRect.left &&
        cx <= arenaRect.right &&
        cy >= arenaRect.top &&
        cy <= arenaRect.bottom;

      if (insideArena && dist < triggerRadius) {
        randomPosFarFromPointer(cx, cy);
      }
    };

    const onTouchStart = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      randomPosFarFromPointer(t.clientX, t.clientY);
    };

    arena.addEventListener("mousemove", onMove);
    arena.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      arena.removeEventListener("mousemove", onMove);
      arena.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  // Ensure No is always within bounds on resize/orientation change
  useEffect(() => {
    const onResize = () => {
      const bounds = getBounds();
      if (!bounds) return;
      setNoPos((p) => ({
        x: clamp(p.x, bounds.padding, bounds.maxX),
        y: clamp(p.y, bounds.padding, bounds.maxY),
      }));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleYes = (e) => {
    e.stopPropagation();
    onYes?.();
  };

  return (
    <motion.div
      ref={cardRef}
      className="gate-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="gate-title">Are you ready for the surprise? 💖</div>
      <div className="gate-subtitle">Choose wisely 😌</div>

      {/* arena is the safe area where No can run around */}
      <div className="gate-buttons" ref={arenaRef}>
        <motion.button
          ref={yesBtnRef}
          className="gate-yes"
          onClick={handleYes}
          style={{ transform: `scale(${yesScale})` }}
          whileTap={{ scale: yesScale * 0.95 }}
        >
          Yes ✅
        </motion.button>

        <motion.button
          ref={noBtnRef}
          className="gate-no"
          animate={{ x: noPos.x, y: noPos.y }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="No (you can't click this)"
        >
          No ❌
        </motion.button>
      </div>
      <div className="gate-disclaimer">Something magical is about to unfold 🤭</div>
    </motion.div>
  );
};

export default SurpriseGate;
