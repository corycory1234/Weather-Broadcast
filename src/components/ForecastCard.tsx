import { useTranslation } from 'react-i18next';
import { wmoToEmoji } from '../services/weatherApi';

interface ForecastCardProps {
  date: string;        // ISO date "2025-05-17"
  weatherCode: number; // WMO code
  tempMax: number;
  tempMin: number;
  animationDelay: number;
  rangeStart: number;  // 0-100 percentage offset for the range bar
  rangeWidth: number;  // 0-100 percentage width for the range bar
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export function ForecastCard(props: ForecastCardProps) {
  const { date, weatherCode, tempMax, tempMin, animationDelay, rangeStart, rangeWidth } = props;
  const { t } = useTranslation();

  // Parse the ISO date as local noon to avoid timezone shifts
  const dateObj = new Date(date + 'T12:00:00');
  const dayKey = DAY_KEYS[dateObj.getDay()];
  const emoji = wmoToEmoji(weatherCode);

  return (
    <div
      className="animate-fade-in-up forecast-card"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <span className="section-label">{t(`days.${dayKey}`)}</span>
      <span className="text-3xl leading-none select-none">{emoji}</span>
      <p className="text-lg font-bold font-body text-wx-base tabular-nums leading-none">
        {Math.round(tempMax)}°
      </p>
      <p className="text-sm font-body text-wx-muted tabular-nums leading-none">
        {Math.round(tempMin)}°
      </p>

      {/* Temperature range bar */}
      <div className="temp-range-bar mt-1">
        <div
          className="temp-range-fill"
          style={{
            left: `${rangeStart}%`,
            width: `${Math.max(rangeWidth, 8)}%`,
          }}
        />
      </div>
    </div>
  );
}
