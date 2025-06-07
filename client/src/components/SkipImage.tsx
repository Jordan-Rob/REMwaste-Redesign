import { motion } from "framer-motion";

interface SkipImageProps {
  size: number;
  className?: string;
}

export function SkipImage({ size, className = "" }: SkipImageProps) {
  // Different skip shapes based on size
  const getSkipSVG = (skipSize: number) => {
    const isLarge = skipSize >= 20;
    const baseColor = "#F59E0B"; // Yellow-500
    const shadowColor = "#D97706"; // Yellow-600
    const logoColor = "#1F2937"; // Gray-800

    if (isLarge) {
      // Large rectangular skip (20+ yards)
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Shadow */}
          <path
            d="M25 85 L175 85 L185 100 L35 100 Z"
            fill={shadowColor}
            opacity="0.6"
          />
          {/* Main body */}
          <rect
            x="20" y="40" 
            width="160" height="45"
            fill={baseColor}
            stroke={shadowColor}
            strokeWidth="2"
          />
          {/* Front face */}
          <path
            d="M20 40 L30 25 L190 25 L180 40 Z"
            fill="#FCD34D"
          />
          {/* Side face */}
          <path
            d="M180 40 L190 25 L190 70 L180 85 Z"
            fill={shadowColor}
          />
          {/* Logo */}
          <text
            x="100" y="65"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill={logoColor}
          >
            WE WANT WASTE
          </text>
        </svg>
      );
    } else {
      // Standard skip shape
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Shadow */}
          <ellipse cx="100" cy="110" rx="85" ry="8" fill={shadowColor} opacity="0.3" />
          {/* Main body */}
          <path
            d="M30 90 L40 35 L160 35 L170 90 L150 95 L50 95 Z"
            fill={baseColor}
            stroke={shadowColor}
            strokeWidth="2"
          />
          {/* Front lip */}
          <path
            d="M40 35 L45 25 L155 25 L160 35 Z"
            fill="#FCD34D"
          />
          {/* Side panel */}
          <path
            d="M150 95 L170 90 L165 45 L155 50 Z"
            fill={shadowColor}
          />
          {/* Logo */}
          <text
            x="100" y="70"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill={logoColor}
          >
            WE WANT
          </text>
          <text
            x="100" y="82"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill={logoColor}
          >
            WASTE
          </text>
        </svg>
      );
    }
  };

  return (
    <motion.div 
      className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {getSkipSVG(size)}
    </motion.div>
  );
}