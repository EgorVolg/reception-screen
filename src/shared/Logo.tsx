export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="b_R_9itb_"
          x1="10"
          y1="6"
          x2="38"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ff8ad4"></stop>
          <stop offset="0.55" stopColor="#d94fb0"></stop>
          <stop offset="1" stopColor="#a894ee"></stop>
        </linearGradient>
      </defs>
      <path
        d="M7 24.5C7 14.2 14.6 6 24 6s17 8.2 17 18.5c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2Z"
        fill="url(#b_R_9itb_)"
      ></path>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 30.5c-1.6 3.4 1.6 5.6 0 9.5"></path>
        <path d="M34 30.5c1.6 3.4-1.6 5.6 0 9.5"></path>
        <path d="M24 30v3.2l-3 3.2 6 3.6-3 2.5V44"></path>
      </g>
    </svg>
  );
};
