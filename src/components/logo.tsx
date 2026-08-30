export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="11" fill="#1e3a8a" />
      <circle cx="20" cy="13" r="5.2" fill="#fbbf24" />
      <path
        d="M20 18.2v2.4"
        stroke="#fbbf24"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8.5 28.5c3.2-4.4 7.1-6.6 11.5-6.6s8.3 2.2 11.5 6.6"
        stroke="#e0e7ff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 28.8h18c.4 0 .7.4.6.8l-1.2 4.2c-.1.3-.4.5-.7.5H12.3c-.3 0-.6-.2-.7-.5L10.4 29.6c-.1-.4.2-.8.6-.8Z"
        fill="#fff"
      />
      <path d="M20 28.8v5.5" stroke="#1e3a8a" strokeWidth="1.3" />
    </svg>
  );
}
