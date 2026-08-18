import React from 'react';

interface ScoreRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  showGrade?: boolean;
  label?: string;
  grade?: string;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 80,
  strokeWidth = 6,
  showGrade = false,
  label = 'Layout Score',
  grade,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorHex = '#10B981'; // green >= 85
  let gradeText = grade || 'Excellent';

  if (score < 70) {
    colorHex = '#EF4444'; // red
    if (!grade) gradeText = 'Needs Work';
  } else if (score < 85) {
    colorHex = '#F59E0B'; // amber
    if (!grade) gradeText = 'Good';
  }

  // Adaptive font size based on diameter
  const isSmall = size <= 54;
  const isMedium = size > 54 && size < 90;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E8E6DF"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="dark:stroke-[#262C36]"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorHex}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none leading-none">
          <span
            className={`font-mono font-black tracking-tight text-neutral-900 dark:text-white ${
              isSmall ? 'text-xs' : isMedium ? 'text-lg' : 'text-2xl'
            }`}
          >
            {score}
          </span>
          {!isSmall && (
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
              /100
            </span>
          )}
        </div>
      </div>

      {showGrade && (
        <div className="mt-1.5 text-center">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block"
            style={{
              color: colorHex,
              backgroundColor: `${colorHex}18`,
            }}
          >
            {gradeText}
          </span>
          {label && <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">{label}</p>}
        </div>
      )}
    </div>
  );
};
