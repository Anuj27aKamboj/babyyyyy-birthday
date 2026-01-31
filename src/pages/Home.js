import { useState } from "react";
import Countdown from "../components/Countdown";
import PostReveal from "../components/PostReveal";
import "../styles/global.css";

const Home = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="app-root">
      {!isRevealed ? (
        <Countdown onComplete={() => setIsRevealed(true)} />
      ) : (
        <PostReveal />
      )}
    </div>
  );
};

export default Home;
