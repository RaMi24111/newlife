import React, { CSSProperties, ReactNode } from 'react';

interface GradientProps {
  colors: [string, string] | [string, string, string];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Gradient: React.FC<GradientProps> = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  children,
  className = '',
  style = {},
}) => {
  // Convert start/end to degrees
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90;
  
  const gradientStyle: CSSProperties = {
    background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
    ...style,
  };

  return (
    <div className={className} style={gradientStyle}>
      {children}
    </div>
  );
};
