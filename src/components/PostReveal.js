import GalleryCarousel from "./GalleryCarousel";
import BirthdayMessage from "./BirthdayMessage";
import { motion } from "framer-motion";

const PostReveal = () => {
  return (
    <div className="reveal-wrap">
      <motion.h1
        className="reveal-title"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Happy Birthday, My Love 🎀
      </motion.h1>

      <GalleryCarousel />

      <BirthdayMessage />
    </div>
  );
};

export default PostReveal;
