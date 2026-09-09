import type {CSSProperties} from 'react';
import {SOURCE_CAPTION} from '../data/trendSummary';
import {COLORS, FONT_FAMILY} from '../lib/theme';
import {TYPOGRAPHY} from '../lib/typography';

export interface SourceCaptionProps {
  readonly text?: string;
  readonly style?: CSSProperties;
}

export const SourceCaption = ({
  text = SOURCE_CAPTION,
  style,
}: SourceCaptionProps) => (
  <div
    style={{
      color: COLORS.faintText,
      fontFamily: FONT_FAMILY,
      ...TYPOGRAPHY.source,
      ...style,
    }}
  >
    {text}
  </div>
);
