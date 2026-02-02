import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const SurpriseGate = ({ onYes }) => {
  const cardRef = useRef(null);
  const arenaRef = useRef(null);
  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);

  const [yesScale, setYesScale] = useState(1);
  const [noPos, setNoPos] = useState({ x: 12, y: 70 });

  /* ---------------- YES grows on any click except YES ---------------- */
  useEffect(() => {
    const handleDocClick = (e) => {
      if (yesBtnRef.current && yesBtnRef.current.contains(e.target)) return;
      setYesScale((s) => clamp(s + 0.08, 1, 1.9));
    };

    document.addEventListener("click", handleDocClick, true);
    return () => document.removeEventListener("click", handleDocClick, true);
  }, []);

  /* ---------------- bounds helper (stable) ---------------- */
  const getBounds = useCallback(() => {
    const arena = arenaRef.current;
    const noBtn = noBtnRef.current;
    if (!arena || !noBtn) return null;

    const a = arena.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();

    const padding = 10;

    const maxX = Math.max(padding, a.width - b.width - padding);
    const maxY = Math.max(padding, a.height - b.height - padding);

    return { padding, maxX, maxY, arenaRect: a };
  }, []);

  /* ---------------- pick a far position (stable) ---------------- */
  const randomPosFarFromPointer = useCallback((clientX, clientY) => {
    const bounds = getBounds();
    if (!bounds) return { x: 12, y: 70 };

    const { padding, maxX, maxY, arenaRect } = bounds;

    // pointer relative to arena
    const px = clientX - arenaRect.left;
    const py = clientY - arenaRect.top;

    // go opposite side
    const targetX = px < arenaRect.width / 2 ? maxX : padding;
    const targetY = py < arenaRect.height / 2 ? maxY : padding;

    // playful jitter
    const jitterX = (Math.random() - 0.5) * 40;
    const jitterY = (Math.random() - 0.5) * 30;

    return {
      x: clamp(targetX + jitterX, padding, maxX),
      y: clamp(targetY + jitterY, padding, maxY),
    };
  }, [getBounds]);

  /* ---------------- Move "No" when pointer gets close ---------------- */
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

      // pointer must be inside arena
      const insideArena =
        cx >= arenaRect.left &&
        cx <= arenaRect.right &&
        cy >= arenaRect.top &&
        cy <= arenaRect.bottom;

      if (!insideArena) return;

      // distance from pointer to center of No
      const nx = noRect.left + noRect.width / 2;
      const ny = noRect.top + noRect.height / 2;

      const dx = cx - nx;
      const dy = cy - ny;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const triggerRadius = 90;
      if (dist < triggerRadius) {
        setNoPos(randomPosFarFromPointer(cx, cy));
      }
    };

    const onTouchStart = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      setNoPos(randomPosFarFromPointer(t.clientX, t.clientY));
    };

    arena.addEventListener("mousemove", onMove);
    arena.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      arena.removeEventListener("mousemove", onMove);
      arena.removeEventListener("touchstart", onTouchStart);
    };
  }, [getBounds, randomPosFarFromPointer]);

  /* ---------------- Keep No inside bounds on resize/orientation ---------------- */
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
  }, [getBounds]);

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
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="No (you can't click this)"
        >
          No ❌
        </motion.button>
      </div>

      <div className="gate-disclaimer">
        Something magical is about to unfold 🤭
      </div>
    </motion.div>
  );
};

export default SurpriseGate;
