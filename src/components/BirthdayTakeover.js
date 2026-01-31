import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const BirthdayTakeover = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    // iOS / browser autoplay safety:
    // audio will play on first user interaction
    const playAudio = () => {
      audioRef.current?.play();
      document.removeEventListener("click", playAudio);
    };

    document.addEventListener("click", playAudio);
  }, []);

  return (
    <motion.div
      className="birthday-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <audio ref={audioRef} src="/audio/birthday.mp3" loop />

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        🎉 Happy Birthday My Love 🎂
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        Today is all about you 💖
      </motion.p>
    </motion.div>
  );
};

export default BirthdayTakeover;
