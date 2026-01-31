import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

// MUST be false for real run
const TEST_MODE = false;

// IST offset (+05:30)
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const getNowISTMs = () => Date.now() + IST_OFFSET_MS;

// Build IST target
const makeISTTargetMs = (year, month1to12, day, hour = 0, min = 0, sec = 0) => {
  const utcMs =
    Date.UTC(year, month1to12 - 1, day, hour, min, sec) - IST_OFFSET_MS;
  return utcMs + IST_OFFSET_MS;
};

const FloatingHearts = () => {
  const hearts = new Array(18).fill(0).map((_, i) => i);

  return (
    <div className="float-layer" aria-hidden="true">
      {hearts.map((i) => (
        <motion.span
          key={i}
          className="float-heart"
          initial={{
            opacity: 0,
            x: `${Math.random() * 100}vw`,
            y: `110vh`,
            scale: 0.6 + Math.random() * 1.2,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: `-20vh`,
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            delay: Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ❤
        </motion.span>
      ))}
    </div>
  );
};

const Digit = ({ value }) => (
  <motion.div
    className="digit"
    key={value}
    initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
    transition={{ duration: 0.35, ease: "easeOut" }}
  >
    {value}
  </motion.div>
);

const Countdown = ({ onComplete }) => {
  const [hh, setHh] = useState("00");
  const [mm, setMm] = useState("00");
  const [ss, setSs] = useState("00");
  const [soundOn, setSoundOn] = useState(false);

  const completedRef = useRef(false);

  // 🎵 Audio refs
  const musicRef = useRef(null);
  const tickRef = useRef(null);

  const targetISTMs = useMemo(() => {
    if (TEST_MODE) return getNowISTMs() + 90 * 1000;
    return makeISTTargetMs(2026, 2, 2, 0, 0, 0);
  }, []);

  // Init audio once
  useEffect(() => {
    musicRef.current = new Audio("/audio/soft.mp3");
    musicRef.current.loop = true;
    musicRef.current.volume = 0.45;

    tickRef.current = new Audio("/audio/tick.mp3");
    tickRef.current.volume = 0.9;
  }, []);

  // Toggle sound
  const toggleSound = () => {
    if (!musicRef.current) return;

    if (!soundOn) {
      musicRef.current.play().catch(() => {});
    } else {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }

    setSoundOn((v) => !v);
  };

  // Countdown loop
  useEffect(() => {
    const update = () => {
      const now = getNowISTMs();
      const diff = targetISTMs - now;

      if (diff <= 0) {
        setHh("00");
        setMm("00");
        setSs("00");

        musicRef.current?.pause();

        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(
        Math.floor((totalSeconds % 3600) / 60)
      ).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");

      // Tick only last 10 seconds (if sound ON)
      if (soundOn && totalSeconds <= 10 && tickRef.current) {
        tickRef.current.currentTime = 0;
        tickRef.current.play().catch(() => {});
      }

      setHh(hours);
      setMm(minutes);
      setSs(seconds);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [onComplete, targetISTMs, soundOn]);

  return (
    <div className="scene">
      <FloatingHearts />

      {/* 🔊 SOUND TOGGLE */}
      <button
        className="sound-toggle"
        onClick={toggleSound}
        aria-label="Toggle sound"
      >
        {soundOn ? "🔈" : "🔇"}
      </button>

      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.h1
          className="hero-title"
          animate={{
            filter: [
              "drop-shadow(0 0 0 rgba(255,105,180,0))",
              "drop-shadow(0 0 22px rgba(255,105,180,0.55))",
              "drop-shadow(0 0 0 rgba(255,105,180,0))",
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Almost there Jaaaaaaaaaaaaaaaaaaaaaaaaan💗
        </motion.h1>

        <motion.div
          className="countdown-card"
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <div className="time-row">
            <Digit value={hh} />
            <span className="colon">:</span>
            <Digit value={mm} />
            <span className="colon">:</span>
            <Digit value={ss} />
          </div>

          <div className="subtitle">
            Countdown to{" "}
            <span className="subtitle-strong">
              02 Feb 2026 • 12:00 AM IST
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Countdown;
