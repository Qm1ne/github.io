import { useId } from "react";

/**
 * The A-to-G energy rating scale, drawn rather than shipped as an image.
 *
 * It is seven coloured bars and seven letters, so a bitmap was the wrong
 * format for it: this is a fraction of the bytes, stays sharp at any size,
 * and the letters are real text to a screen reader through the title.
 */
const BANDS = [
  { letter: "A", fill: "#00a651", width: 46 },
  { letter: "B", fill: "#4cb847", width: 54 },
  { letter: "C", fill: "#a3ce3d", width: 62 },
  // Yellow and amber cannot carry white text at any readable contrast, so
  // those two letters are dark.
  { letter: "D", fill: "#f6eb16", width: 70, ink: "#1f2937" },
  { letter: "E", fill: "#fcb814", width: 78, ink: "#1f2937" },
  { letter: "F", fill: "#f3701b", width: 86 },
  { letter: "G", fill: "#ed1c24", width: 94 },
];

const ROW = 10;
const GAP = 2;
const TIP = 6;
const HEIGHT = BANDS.length * (ROW + GAP) - GAP;

export function EnergyRatingScale({
  title,
  className,
}: {
  /** Describes the whole graphic, in the page's language. */
  title: string;
  className?: string;
}) {
  const titleId = useId();

  return (
    <svg
      viewBox={`0 0 100 ${HEIGHT}`}
      role="img"
      aria-labelledby={titleId}
      className={className}
    >
      <title id={titleId}>{title}</title>
      {BANDS.map((band, index) => {
        const y = index * (ROW + GAP);
        const tipX = band.width - TIP;
        return (
          <g key={band.letter}>
            <path
              d={`M0 ${y} H${tipX} L${band.width} ${y + ROW / 2} L${tipX} ${
                y + ROW
              } H0 Z`}
              fill={band.fill}
            />
            <text
              x={tipX - 5}
              y={y + ROW / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="6.5"
              fontWeight="700"
              fill={band.ink ?? "#ffffff"}
            >
              {band.letter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
