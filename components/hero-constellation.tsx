"use client";

import { motion } from "framer-motion";

const fieldPoints = [
  { x: 40, y: 60 },
  { x: 90, y: 30 },
  { x: 130, y: 90 },
  { x: 60, y: 140 },
  { x: 180, y: 50 },
  { x: 220, y: 120 },
  { x: 260, y: 40 },
  { x: 300, y: 100 },
  { x: 150, y: 200 },
  { x: 240, y: 190 },
  { x: 330, y: 160 },
  { x: 30, y: 220 },
  { x: 200, y: 260 },
  { x: 290, y: 240 },
  { x: 350, y: 60 },
];

export function HeroConstellation() {
  return (
    <svg
      viewBox="0 0 380 300"
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {fieldPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={1.4}
          className="fill-ink-line dark:fill-text-on-ink-muted"
          opacity={0.5}
        />
      ))}

      <motion.path
        d="M 90 220 C 130 140, 210 90, 290 70"
        stroke="var(--brass)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
      />

      <motion.circle
        cx={90}
        cy={220}
        r={6}
        fill="var(--garnet)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.circle
        cx={290}
        cy={70}
        r={6}
        fill="var(--garnet)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      />

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <rect
          x={150}
          y={118}
          width={64}
          height={26}
          rx={13}
          className="fill-paper-raised dark:fill-ink-raised"
          stroke="var(--brass)"
          strokeWidth="1"
        />
        <text
          x={182}
          y={135}
          textAnchor="middle"
          className="fill-text-strong dark:fill-text-on-ink"
          style={{ fontSize: 12, fontFamily: "var(--font-sans)", fontWeight: 600 }}
        >
          92%
        </text>
      </motion.g>
    </svg>
  );
}
