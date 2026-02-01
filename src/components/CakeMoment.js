import { useState } from "react";
import { motion } from "framer-motion";

const CakeMoment = ({ onBlow }) => {
  const [blown, setBlown] = useState(false);

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);
    onBlow?.();
  };

  return (
    <div className="cake-wrap">
      <div className="cake-area">
        <img src="/gallery/cake.png" alt="Birthday Cake" className="cake-img" />

        {/* If your cake image already has 29, remove this */}
        <div className="cake-age">29</div>

        {/* Candle (touching cake) */}
        <div className="candle">
          {!blown && (
            <motion.div
              className="flame"
              animate={{ scale: [1, 1.12, 1], rotate: [-4, 4, -4] }}
              transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>

      {!blown && (
        <motion.button
          className="blow-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBlow}
        >
          Blow the candle 🕯️
        </motion.button>
      )}
    </div>
  );
};

export default CakeMoment;
