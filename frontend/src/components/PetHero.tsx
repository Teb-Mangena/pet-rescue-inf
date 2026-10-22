export default function PetHero() {
  return (
    <div className="relative w-[75%] aspect-square">
      {/* soft blob */}
      <div className="absolute inset-0 rounded-[42%_58%_55%_45%/50%_45%_55%_50%] bg-bone/40" />

      <svg
        viewBox="0 0 300 300"
        className="absolute inset-0 w-full h-full animate-bob"
      >
        {/* body */}
        <ellipse cx="150" cy="215" rx="78" ry="58" fill="#E8A33D" />
        {/* head */}
        <circle cx="150" cy="132" r="62" fill="#E8A33D" />
        {/* snout */}
        <ellipse cx="150" cy="158" rx="34" ry="26" fill="#F5F1EA" />
        {/* nose */}
        <ellipse cx="150" cy="148" rx="10" ry="7" fill="#1A1A1A" />
        {/* eyes */}
        <g className="animate-blink" style={{ transformOrigin: "120px 118px" }}>
          <circle cx="120" cy="118" r="7" fill="#1A1A1A" />
        </g>
        <g className="animate-blink" style={{ transformOrigin: "180px 118px" }}>
          <circle cx="180" cy="118" r="7" fill="#1A1A1A" />
        </g>
        {/* ears */}
        <ellipse
          cx="105"
          cy="90"
          rx="22"
          ry="34"
          fill="#A63A1C"
          transform="rotate(-20 105 90)"
        />
        <ellipse
          cx="195"
          cy="90"
          rx="22"
          ry="34"
          fill="#A63A1C"
          transform="rotate(20 195 90)"
        />
        {/* tail */}
        <g className="animate-wag" style={{ transformOrigin: "228px 205px" }}>
          <path
            d="M228 205 Q262 185 270 152"
            stroke="#E8A33D"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}
