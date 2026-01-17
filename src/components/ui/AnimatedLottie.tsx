import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface AnimatedLottieProps {
  src: string; // URL to a Lottie JSON
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export default function AnimatedLottie({ src, loop = true, autoplay = true, className }: AnimatedLottieProps) {
  const [animation, setAnimation] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(src);
        const json = await res.json();
        if (mounted) setAnimation(json);
      } catch (e) {
        console.warn("Failed to load Lottie animation:", e);
      }
    }
    load();
    return () => { mounted = false };
  }, [src]);

  if (!animation) return <div className={className} />;

  return (
    <div className={className}>
      <Lottie animationData={animation} loop={loop} autoplay={autoplay} />
    </div>
  );
}
