import { useTranslation } from 'react-i18next';
import type { OpenMeteoDailyDay } from '../types/openmeteo';
import { wmoToEmoji } from '../services/weatherApi';

interface MonthlyDayItemProps {
  day: OpenMeteoDailyDay;
  isToday: boolean;
  globalMin: number;
  globalMax: number;
  index: number;
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export function MonthlyDayItem(props: MonthlyDayItemProps) {
  const { day, isToday, globalMin, globalMax, index } = props;
  const { t } = useTranslation();

  const dateObj = new Date(day.date + 'T12:00:00');
  const dayKey = DAY_KEYS[dateObj.getDay()];
  const dateLabel = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
  const emoji = wmoToEmoji(day.weatherCode);

  const range = globalMax - globalMin || 1;
  const barStart = ((day.tempMin - globalMin) / range) * 100;
  const barWidth = Math.max(((day.tempMax - day.tempMin) / range) * 100, 6);

  return (
    <div
      className="animate-fade-in-up flex items-center gap-4 py-3.5 border-b border-wx"
      style={{ animationDelay: `${index * 35}ms` }}
    >
      {/* Date column */}
      <div className="w-20 shrink-0">
        <span
          className="section-label"
          style={isToday ? { color: 'var(--color-accent)' } : undefined}
        >
          {isToday ? t('monthly.today') : t(`days.${dayKey}`)}
        </span>
        <p className="font-mono text-sm text-wx-base tabular-nums mt-0.5">
          {dateLabel}
        </p>
      </div>

      {/* Emoji */}
      <span className="text-2xl leading-none select-none w-8 text-center shrink-0">
        {emoji}
      </span>

      {/* Temperature range bar */}
      <div className="flex-1 min-w-0">
        <div className="temp-range-bar">
          <div
            className="temp-range-fill"
            style={{ left: `${barStart}%`, width: `${barWidth}%` }}
          />
        </div>
      </div>

      {/* Max / Min temps */}
      <div className="flex items-center gap-3 shrink-0 tabular-nums">
        <span className="font-body font-bold text-wx-base text-sm">
          {Math.round(day.tempMax)}°
        </span>
        <span className="font-body text-wx-muted text-sm">
          {Math.round(day.tempMin)}°
        </span>
      </div>
    </div>
  );
}
