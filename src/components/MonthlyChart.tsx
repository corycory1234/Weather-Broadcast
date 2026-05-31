import type { OpenMeteoDailyDay } from '../types/openmeteo';

interface MonthlyChartProps {
  days: OpenMeteoDailyDay[];
  todayDate: string; // "2025-05-17"
}

const W = 760;
const H = 200;
const PAD = { top: 24, right: 20, bottom: 36, left: 40 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

export function MonthlyChart(props: MonthlyChartProps) {
  const { days, todayDate } = props;

  if (days.length === 0) return null;

  const allTemps = days.flatMap(d => [d.tempMax, d.tempMin]);
  const rawMin = Math.min(...allTemps);
  const rawMax = Math.max(...allTemps);
  const pad = Math.max((rawMax - rawMin) * 0.18, 3);
  const tMin = rawMin - pad;
  const tMax = rawMax + pad;

  const xOf = (i: number) =>
    PAD.left + (days.length > 1 ? (i / (days.length - 1)) * INNER_W : INNER_W / 2);
  const yOf = (temp: number) =>
    PAD.top + (1 - (temp - tMin) / (tMax - tMin)) * INNER_H;

  const maxPts = days.map((d, i) => [xOf(i), yOf(d.tempMax)] as [number, number]);
  const minPts = days.map((d, i) => [xOf(i), yOf(d.tempMin)] as [number, number]);

  const polylinePoints = (pts: [number, number][]) =>
    pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  const areaPath = [
    `M ${maxPts[0][0].toFixed(1)} ${maxPts[0][1].toFixed(1)}`,
    ...maxPts.slice(1).map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`),
    ...minPts.slice().reverse().map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`),
    'Z',
  ].join(' ');

  // Y-axis grid ticks
  const tempRange = tMax - tMin;
  const rawStep = tempRange / 4;
  const tickStep = Math.max(Math.ceil(rawStep / 5) * 5, 1);
  const firstTick = Math.ceil(tMin / tickStep) * tickStep;
  const yTicks: number[] = [];
  for (let t = firstTick; t <= tMax; t += tickStep) yTicks.push(t);

  const todayIdx = days.findIndex(d => d.date === todayDate);

  // Show every-other x-label when there are many days
  const labelStep = days.length > 10 ? 2 : 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block', overflow: 'visible' }}
      role="img"
      aria-label="Monthly temperature chart"
    >
      <defs>
        <linearGradient id="mc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.05" />
        </linearGradient>
        <clipPath id="mc-clip">
          <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} />
        </clipPath>
      </defs>

      {/* Horizontal grid lines + y-axis labels */}
      {yTicks.map(t => (
        <g key={t}>
          <line
            x1={PAD.left} y1={yOf(t)}
            x2={PAD.left + INNER_W} y2={yOf(t)}
            stroke="var(--color-border)"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 6}
            y={yOf(t)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="10"
            fill="var(--color-text-muted)"
            fontFamily="var(--font-mono)"
          >
            {t}°
          </text>
        </g>
      ))}

      {/* Today vertical guide line */}
      {todayIdx >= 0 && (
        <line
          x1={xOf(todayIdx)} y1={PAD.top}
          x2={xOf(todayIdx)} y2={PAD.top + INNER_H}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.55"
        />
      )}

      {/* Filled area between max and min */}
      <path d={areaPath} fill="url(#mc-fill)" clipPath="url(#mc-clip)" />

      {/* Max temperature line */}
      <polyline
        points={polylinePoints(maxPts)}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        clipPath="url(#mc-clip)"
      />

      {/* Min temperature line (dashed) */}
      <polyline
        points={polylinePoints(minPts)}
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="4 3"
        clipPath="url(#mc-clip)"
      />

      {/* Dots on max line */}
      {maxPts.map(([x, y], i) => (
        <circle
          key={`mx-${i}`}
          cx={x} cy={y}
          r={days[i].date === todayDate ? 4.5 : 2.5}
          fill="var(--color-accent)"
          opacity={days[i].date === todayDate ? 1 : 0.75}
        />
      ))}

      {/* Dots on min line */}
      {minPts.map(([x, y], i) => (
        <circle
          key={`mn-${i}`}
          cx={x} cy={y}
          r={2}
          fill="var(--color-text-muted)"
          opacity="0.55"
        />
      ))}

      {/* X-axis date labels */}
      {days.map((d, i) => {
        if (i % labelStep !== 0) return null;
        const dateObj = new Date(d.date + 'T12:00:00');
        const isToday = d.date === todayDate;
        return (
          <text
            key={d.date}
            x={xOf(i)}
            y={PAD.top + INNER_H + 16}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-mono)"
            fontWeight={isToday ? '700' : '400'}
            fill={isToday ? 'var(--color-accent)' : 'var(--color-text-muted)'}
          >
            {dateObj.getMonth() + 1}/{dateObj.getDate()}
          </text>
        );
      })}
    </svg>
  );
}
