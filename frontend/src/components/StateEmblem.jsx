import React from 'react';

export default function StateEmblem({ width = 34, height = 42, color = "#0a194e" }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="State Emblem of India"
    >
      {/* Central Lion Head & Mane */}
      <path
        d="M50 8C43 8 38 13 38 20C38 23 39 25 41 27C38 29 36 33 36 37C36 43 40 48 45 50C44 52 43 54 43 56L42 62H58L57 56C57 54 56 52 55 50C60 48 64 43 64 37C64 33 62 29 59 27C61 25 62 23 62 20C62 13 57 8 50 8Z"
        fill={color}
      />
      {/* Central Lion Face details */}
      <path d="M47 18H53M46 22H54M48 26L50 28L52 26" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="45" cy="18" r="1.2" fill="#ffffff" />
      <circle cx="55" cy="18" r="1.2" fill="#ffffff" />

      {/* Left Lion Silhouette */}
      <path
        d="M26 22C21 22 17 26 17 31C17 33.5 18 35.5 19.5 37C17 39 15.5 42 15.5 45.5C15.5 50.5 19 54.5 23.5 56C23 58 22.5 60 22.5 62H36L35 55C31.5 53 29 49 29 44C29 41.5 30 39.5 31.5 38C29.5 36.5 28 34 28 31C28 26 31 23 35 22.5L34 22H26Z"
        fill={color}
      />
      <circle cx="23" cy="29" r="1" fill="#ffffff" />
      <path d="M20 33H26" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />

      {/* Right Lion Silhouette */}
      <path
        d="M74 22C79 22 83 26 83 31C83 33.5 82 35.5 80.5 37C83 39 84.5 42 84.5 45.5C84.5 50.5 81 54.5 76.5 56C77 58 77.5 60 77.5 62H64L65 55C68.5 53 71 49 71 44C71 41.5 70 39.5 68.5 38C70.5 36.5 72 34 72 31C72 26 69 23 65 22.5L66 22H74Z"
        fill={color}
      />
      <circle cx="77" cy="29" r="1" fill="#ffffff" />
      <path d="M74 33H80" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />

      {/* Abacus platform / base band */}
      <rect x="14" y="63" width="72" height="7" rx="2" fill={color} />
      
      {/* Central Ashoka Chakra */}
      <circle cx="50" cy="79" r="9" stroke={color} strokeWidth="2.5" fill="none" />
      <circle cx="50" cy="79" r="2.2" fill={color} />
      {/* Spokes of the Chakra */}
      <path
        d="M50 70V88 M41 79H59 M43.6 72.6L56.4 85.4 M43.6 85.4L56.4 72.6 M46.5 70.5L53.5 87.5 M46.5 87.5L53.5 70.5 M41.5 75.5L58.5 82.5 M41.5 82.5L58.5 75.5"
        stroke={color}
        strokeWidth="0.9"
      />

      {/* Galloping Horse (Left of Chakra) */}
      <path
        d="M23 74C25 72 28 73 30 75L33 76L31 80L28 78L26 84H23L24 79L20 81L19 79L23 74Z"
        fill={color}
      />

      {/* Bull (Right of Chakra) */}
      <path
        d="M77 74C75 72 72 73 70 75L67 76L69 80L72 78L74 84H77L76 79L80 81L81 79L77 74Z"
        fill={color}
      />

      {/* Lotus Bell Pedestal Base */}
      <path
        d="M18 90C28 89 40 92 50 92C60 92 72 89 82 90C84 94 82 98 80 100H20C18 98 16 94 18 90Z"
        fill={color}
      />
      {/* Bottom base plinth */}
      <rect x="12" y="101" width="76" height="5" rx="1.5" fill={color} />
      
      {/* Satyameva Jayate Devnagari script representation */}
      <rect x="25" y="108" width="50" height="2" rx="1" fill={color} />
      <path d="M30 112H34M38 112H44M48 112H54M58 112H64M68 112H72" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
