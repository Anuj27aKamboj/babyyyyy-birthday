import { useState } from "react";
import { motion } from "framer-motion";
import CelebrationBurst from "./CelebrationBurst";
import GalleryCarousel from "./GalleryCarousel";
import SurpriseGate from "./SurpriseGate";
import CakeMoment from "./CakeMoment";
import BirthdayMessage from "./BirthdayMessage";

const PostReveal = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="reveal-wrap">
      {!unlocked ? (
        <>
          <motion.h1
            className="reveal-title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Birthday Mode 🎀
          </motion.h1>

          <SurpriseGate onYes={() => setUnlocked(true)} />
        </>
      ) : (
        <>
          <CelebrationBurst trigger={unlocked} />

          <motion.h1
            className="reveal-title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Happy Birthday, My Love 🎀
          </motion.h1>

          <GalleryCarousel />

          {/* Cake always shows after YES */}
          <CakeMoment onBlow={() => setShowMessage(true)} />

          {/* Message appears ONLY after blow + oscillates */}
          {showMessage && (
            <motion.div
              className="message-float"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <BirthdayMessage />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default PostReveal;
