import { useMemo } from "react";
import { motion } from "framer-motion";

/* ---------------- helpers ---------------- */
const rand = (min, max) => Math.random() * (max - min) + min;

const CONFETTI_COLORS = ["#ff7ac8", "#ffd1e8", "#ffffff", "#ff9bd5", "#ffc0e0"];

/* ---------------- CONFETTI POPPER (gravity arc) ---------------- */
const ConfettiPopper = ({ side = "left", delay = 0, burstKey = 0 }) => {
  const isLeft = side === "left";

  const pieces = useMemo(() => {
    // burstKey ensures each popper instance gets different randomness
    const count = 34;

    return new Array(count).fill(0).map((_, i) => {
      const size = rand(5, 10);

      // launch direction (up + out), then gravity pulls down
      // x: left popper shoots right; right popper shoots left
      const x1 = isLeft ? rand(80, 240) : rand(-240, -80);
      const x2 = x1 * rand(0.6, 1.05);

      const y1 = rand(-120, -260); // initial "blast" upward
      const y2 = rand(420, 760);   // gravity pull down past bottom

      return {
        id: `${burstKey}-${i}`,
        w: size,
        h: size * rand(0.35, 0.65),
        color: CONFETTI_COLORS[Math.floor(rand(0, CONFETTI_COLORS.length))],
        rot1: rand(-220, 220),
        rot2: rand(380, 980),
        x1,
        x2,
        y1,
        y2,
        duration: rand(1.6, 2.6),
        delay: delay + rand(0, 0.18),
        // stagger a little inside each burst
      };
    });
  }, [delay, isLeft, burstKey]);

  return (
    <motion.div
      className={`popper popper-${side}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.25 }}
      aria-hidden
    >
      <div className="popper-emoji">🎉</div>

      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="confetti-rect"
          style={{
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            pointerEvents: "none",
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            // arc: blast up then fall down
            x: [0, p.x1, p.x2],
            y: [0, p.y1, p.y2],
            rotate: [0, p.rot1, p.rot2],
            opacity: [1, 1, 0],
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
};

/* ---------------- BALLOONS (infinite loop) ---------------- */
const BalloonStream = () => {
  const balloons = useMemo(() => {
    const count = 28;

    return new Array(count).fill(0).map((_, i) => ({
      id: i,
      left: `${rand(4, 96)}vw`,
      size: rand(0.85, 1.35),
      sway: rand(-42, 42),
      duration: rand(12, 22), // smoother + less glitchy
      delay: rand(0, 10),
      emoji: "🎈",
      opacity: rand(0.75, 1),
    }));
  }, []);

  return (
    <div className="balloon-layer" aria-hidden>
      {balloons.map((b) => (
        <motion.span
          key={b.id}
          className="balloon"
          style={{
            left: b.left,
            opacity: b.opacity,
            fontSize: `${34 * b.size}px`,
          }}
          initial={{ y: "110vh", x: 0 }}
          animate={{
            y: "-120vh",
            x: [0, b.sway, -b.sway, 0],
          }}
          transition={{
            delay: b.delay,
            duration: b.duration,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: rand(0, 3), // natural spacing
          }}
        >
          {b.emoji}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- MAIN ---------------- */
const CelebrationBurst = ({ trigger }) => {
  if (!trigger) return null;

  return (
    <>
      {/* 2 poppers each side with different burstKey so randomness differs */}
      <ConfettiPopper side="left" delay={0.05} burstKey={1} />
      <ConfettiPopper side="left" delay={0.18} burstKey={2} />
      <ConfettiPopper side="right" delay={0.05} burstKey={3} />
      <ConfettiPopper side="right" delay={0.18} burstKey={4} />

      {/* Infinite balloons */}
      <BalloonStream />
    </>
  );
};

export default CelebrationBurst;
