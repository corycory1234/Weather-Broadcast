import { useTranslation } from 'react-i18next';
import type { OpenMeteoDailyDay } from '../types/openmeteo';
import { ForecastCard } from './ForecastCard';

interface ForecastStripProps {
  forecast: OpenMeteoDailyDay[];
}

export function ForecastStrip(props: ForecastStripProps) {
  const { forecast } = props;
  const { t } = useTranslation();

  const days = forecast.slice(0, 7);

  const allTemps = days.flatMap(d => [d.tempMax, d.tempMin]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <div className="mt-4">
      <div className="animate-fade-in-up delay-500 py-4">
        <span className="section-label">{t('forecast.title')}</span>
      </div>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
      >
        {days.map((day, index) => {
          const rangeStart = ((day.tempMin - globalMin) / range) * 100;
          const rangeWidth = ((day.tempMax - day.tempMin) / range) * 100;
          return (
            <ForecastCard
              key={day.date}
              date={day.date}
              weatherCode={day.weatherCode}
              tempMax={day.tempMax}
              tempMin={day.tempMin}
              animationDelay={500 + index * 70}
              rangeStart={rangeStart}
              rangeWidth={rangeWidth}
            />
          );
        })}
      </div>
    </div>
  );
}
