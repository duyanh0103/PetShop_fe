/** The paw from the design, used as the image placeholder and empty-state mark. */
export default function PawIcon({ className, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" className={className}>
      <ellipse cx="12" cy="16" rx="5" ry="4.2" />
      <circle cx="6" cy="10" r="2.2" />
      <circle cx="10" cy="6.5" r="2.2" />
      <circle cx="14" cy="6.5" r="2.2" />
      <circle cx="18" cy="10" r="2.2" />
    </svg>
  );
}
