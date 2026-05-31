import type { OpenMeteoDailyDay } from '../types/openmeteo';
import { MonthlyDayItem } from './MonthlyDayItem';

interface MonthlyDayListProps {
  days: OpenMeteoDailyDay[];
  todayDate: string; // "2025-05-17"
}

export function MonthlyDayList(props: MonthlyDayListProps) {
  const { days, todayDate } = props;

  const allTemps = days.flatMap(d => [d.tempMax, d.tempMin]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);

  return (
    <div>
      {days.map((day, index) => (
        <MonthlyDayItem
          key={day.date}
          day={day}
          isToday={day.date === todayDate}
          globalMin={globalMin}
          globalMax={globalMax}
          index={index}
        />
      ))}
    </div>
  );
}
