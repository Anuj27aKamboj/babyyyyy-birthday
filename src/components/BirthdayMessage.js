import { motion } from "framer-motion";

const BirthdayMessage = () => {
  return (
    <motion.div
      className="message-glass"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="message-title">💖 A Message From My Heart 💖</div>

      <p className="beauty-message">
        Happy Birthday, my love.  
        <br /><br />
        You are the reason my ordinary days feel magical.  
        Every smile of yours lights up my world, and every moment with you
        feels like a blessing I never want to take for granted.
        <br /><br />
        Today is your day, but my wish is simple —  
        may every day ahead bring you happiness, love, and everything your
        beautiful heart desires.
        <br /><br />
        I love you, today and always. 🎀
      </p>
    </motion.div>
  );
};

export default BirthdayMessage;
