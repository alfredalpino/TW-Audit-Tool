'use client';

import React from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';

type JellyLineProps = {
  text: string;
  accent?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function JellyLine({ text, accent = false }: JellyLineProps) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const skewX = useMotionValue(0);
  const skewY = useMotionValue(0);

  const onDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
    if (prefersReducedMotion) return;

    const viewportWidth = window.innerWidth;
    const mobile = viewportWidth < 768;
    const stretchRange = mobile ? 145 : 210;
    const maxScaleX = mobile ? 0.11 : 0.14;
    const maxScaleYCompression = mobile ? 0.08 : 0.1;
    const maxSkew = mobile ? 5 : 7;

    const offsetX = info.offset.x;
    const offsetY = info.offset.y;
    const dragMagX = Math.abs(offsetX) / stretchRange;
    const dragMagY = Math.abs(offsetY) / stretchRange;

    const stretchedX = 1 + clamp(dragMagX * 0.13 + dragMagY * 0.04, 0, maxScaleX);
    const stretchedY = 1 - clamp(dragMagY * 0.11 + dragMagX * 0.04, 0, maxScaleYCompression);

    scaleX.set(stretchedX);
    scaleY.set(stretchedY);
    skewX.set(clamp(offsetX / 26, -maxSkew, maxSkew));
    skewY.set(clamp(offsetY / 36, -maxSkew * 0.65, maxSkew * 0.65));
  };

  const onDragEnd = () => {
    animate(x, 0, { type: 'spring', stiffness: 320, damping: 28, mass: 0.7 });
    animate(y, 0, { type: 'spring', stiffness: 320, damping: 28, mass: 0.7 });
    animate(scaleX, 1, { type: 'spring', stiffness: 300, damping: 24, mass: 0.7 });
    animate(scaleY, 1, { type: 'spring', stiffness: 300, damping: 24, mass: 0.7 });
    animate(skewX, 0, { type: 'spring', stiffness: 280, damping: 24, mass: 0.7 });
    animate(skewY, 0, { type: 'spring', stiffness: 280, damping: 24, mass: 0.7 });
  };

  return (
    <motion.div
      drag={prefersReducedMotion ? false : true}
      dragDirectionLock={false}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.28}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 26 }}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      style={{ x, y, touchAction: 'none' }}
      className="cursor-grab active:cursor-grabbing will-change-transform select-none"
      initial={false}
      animate={undefined}
    >
      <motion.span
        className={`block ${accent ? 'text-torpedo-orange' : 'text-torpedo-dark'}`}
        style={{ scaleX, scaleY, skewX, skewY, transformOrigin: 'center center' }}
        initial={false}
        animate={undefined}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}

export default function JellyHeroHeading() {
  return (
    <h1 className="mb-8 leading-[1.1] overflow-x-clip">
      <JellyLine text="Built on Belief." />
      <JellyLine text="Deployed for Growth." accent />
    </h1>
  );
}
