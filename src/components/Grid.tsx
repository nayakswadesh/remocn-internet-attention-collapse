import type {CSSProperties, ReactNode} from 'react';
import {createGridLines, type PlotBounds} from '../lib/chartMath';
import {COLORS} from '../lib/theme';

export interface GridProps {
  readonly bounds: PlotBounds;
  readonly columns?: number;
  readonly rows?: number;
  readonly color?: string;
  readonly opacity?: number;
}

export const Grid = ({
  bounds,
  columns = 12,
  rows = 4,
  color = COLORS.grid,
  opacity = 0.72,
}: GridProps) => {
  const lines = createGridLines(bounds, columns, rows);

  return (
    <g aria-hidden="true" opacity={opacity}>
      {lines.map((line) => (
        <line
          key={line.key}
          x1={line.x1}
          x2={line.x2}
          y1={line.y1}
          y2={line.y2}
          stroke={color}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
};

export interface PageGridProps {
  readonly children?: ReactNode;
  readonly style?: CSSProperties;
}

export const PageGrid = ({children, style}: PageGridProps) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'linear-gradient(rgba(39,39,42,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(39,39,42,0.18) 1px, transparent 1px)',
      backgroundSize: '72px 72px',
      maskImage:
        'linear-gradient(to bottom, transparent 0%, black 24%, black 78%, transparent 100%)',
      ...style,
    }}
  >
    {children}
  </div>
);
