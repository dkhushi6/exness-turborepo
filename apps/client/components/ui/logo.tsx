import React from "react";

type LogoProps = {
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-2xl" },
  lg: { icon: 48, text: "text-4xl" },
};

const Logo = ({ size = "md" }: LogoProps) => {
  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="none"
        width={icon}
        height={icon}
      >
        <path
          d="M 22 13 A 8 8 0 1 0 22 20"
          stroke="#E78A53"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="16.5"
          x2="22"
          y2="16.5"
          stroke="#E78A53"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="13"
          x2="27"
          y2="7.5"
          stroke="#E78A53"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="27" cy="7.5" r="1.8" fill="#E78A53" />
      </svg>

      <span className={`${text} font-semibold tracking-tight`}>
        <span style={{ color: "#E78A53" }}>e</span>xness
      </span>
    </div>
  );
};

export default Logo;
