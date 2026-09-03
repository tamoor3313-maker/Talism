export function ThreadMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 28 C 14 14, 26 14, 32 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="28" r="3.5" fill="currentColor" />
      <circle cx="32" cy="8" r="3.5" fill="currentColor" />
    </svg>
  );
}
