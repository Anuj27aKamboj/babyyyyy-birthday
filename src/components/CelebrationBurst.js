import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

/* ---------------- helpers ---------------- */
const rand = (min, max) => Math.random() * (max - min) + min;

const CONFETTI_COLORS = [
  "#ff7ac8",
  "#ffd1e8",
  "#ffffff",
  "#ff9bd5",
  "#ffc0e0",
];

/* ---------------- CONFETTI POPPER ---------------- */
const ConfettiPopper = ({ side = "left", delay = 0 }) => {
  const isLeft = side === "left";

  const pieces = useMemo(
    () =>
      new Array(26).fill(0).map((_, i) => ({
        id: i,
        size: rand(6, 10),
        color: CONFETTI_COLORS[Math.floor(rand(0, CONFETTI_COLORS.length))],
        x: isLeft ? rand(40, 160) : rand(-160, -40),
        y: rand(-80, -220),
        rotate: rand(-180, 180),
        duration: rand(1.4, 2.2),
        delay: rand(0, 0.15) + delay,
      })),
    [delay, isLeft]
  );

  return (
    <motion.div
      className={`popper popper-${side}`}
      initial={{ opacity: 0, scale: 0.8 }}
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
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            rotate: p.rotate,
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

/* ---------------- BALLOONS (INFINITE LOOP) ---------------- */
const BalloonStream = () => {
  const balloons = useMemo(
    () =>
      new Array(36).fill(0).map((_, i) => ({
        id: i,
        left: `${rand(4, 96)}vw`,
        size: rand(0.9, 1.4),
        sway: rand(-40, 40),
        duration: rand(2, 15),
        delay: rand(0, 10),
        emoji: "🎈",
        opacity: rand(0.75, 1),
      })),
    []
  );

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
      {/* Poppers */}
      <ConfettiPopper side="left" delay={0.05} />
      <ConfettiPopper side="left" delay={0.2} />
      <ConfettiPopper side="right" delay={0.05} />
      <ConfettiPopper side="right" delay={0.2} />

      {/* Infinite balloons */}
      <BalloonStream />
    </>
  );
};

export default CelebrationBurst;
