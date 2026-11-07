import React, { useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./Button";

const HeroSection = ({ messages, index }) => {
  const preloads = useRef(new Map());
  const [imageStatus, setImageStatus] = useState({});
  const [displayedIndex, setDisplayedIndex] = useState(null);
  const [settledIndex, setSettledIndex] = useState(null);

  useEffect(() => {
    let active = true;

    messages.forEach(({ bg }) => {
      // Reuse each request across Strict Mode effect replays and re-renders.
      if (!preloads.current.has(bg)) {
        preloads.current.set(bg, new Promise((resolve) => {
          const image = new Image();
          const finish = (status) => {
            image.onload = null;
            image.onerror = null;
            resolve(status);
          };
          image.onload = async () => {
            try {
              if (typeof image.decode === "function") await image.decode();
              finish("ready");
            } catch {
              finish("failed");
            }
          };
          image.onerror = () => finish("failed");
          image.src = bg;
        }));
      }

      preloads.current.get(bg).then((status) => {
        if (active) setImageStatus((previous) => ({ ...previous, [bg]: status }));
      });
    });

    return () => { active = false; };
  }, [messages]);

  useEffect(() => {
    // If no slide is visible yet, use any ready image while the first loads.
    const nextIndex = imageStatus[messages[index].bg] === "ready"
      ? index
      : displayedIndex === null
        ? messages.findIndex(({ bg }) => imageStatus[bg] === "ready")
        : -1;

    if (nextIndex !== -1) {
      setDisplayedIndex(nextIndex);
      // Establish an opaque base immediately, including during the first fade.
      setSettledIndex((previous) => previous ?? nextIndex);
    }
  }, [index, messages, imageStatus, displayedIndex]);

  const current = messages[displayedIndex ?? 0];

  return (
    <section
      className={`relative isolate text-white bg-cover bg-center bg-no-repeat mt-14 sm:mt-16 md:mt-20`}
      style={{
        minHeight: "50vh",
        height: "600px",
      }}
    >
      {/* Keep the last completed slide opaque until the incoming fade finishes. */}
      {settledIndex !== null && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${messages[settledIndex].bg})` }}
        />
      )}
      {displayedIndex !== null && (
        <Motion.div
          key={current.bg}
          aria-hidden="true"
          className="absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${current.bg})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          onAnimationComplete={() => setSettledIndex(displayedIndex)}
        />
      )}
      <div className="absolute inset-0 z-[2] bg-black/45 mix-blend-multiply" />

      <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 py-6 sm:py-8" style={{ minHeight: "50vh", height: "600px" }}>
        <Motion.h1
          key={displayedIndex ?? "loading"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4"
        >
          {current.text}
        </Motion.h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-10 mt-8">
          <Link to={'/FAQ'}>
            <Button text={'Get Started'} classes={'py-2 px-4 md:py-3 md:px-7 rounded-s-full rounded-e-full bg-yellow-500 border-3 transition-all duration-500 font-bold border-white hover:bg-white hover:text-black'} />
          </Link>
          <Link to={'/FAQ'}>
            <Button text={'Learn More'} classes={'py-2 px-4 md:py-3 md:px-7 rounded-s-full rounded-e-full bg-black border-3 transition-all duration-500 font-bold border-white hover:bg-white hover:text-black'} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



