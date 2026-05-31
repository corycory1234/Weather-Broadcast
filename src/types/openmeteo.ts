export interface OpenMeteoDailyDay {
  date: string;      // "2025-05-17"
  tempMax: number;
  tempMin: number;
  weatherCode: number; // WMO weather code
}

export interface OpenMeteoForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}
