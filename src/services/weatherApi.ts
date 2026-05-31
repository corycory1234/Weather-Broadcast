import axios from 'axios';
import type { CurrentWeatherData } from '../types/weather';
import type { ForecastItem, ForecastResponse } from '../types/forecast';
import type { ApiLang } from '../types/api';
import type { GeoLocation } from '../types/geo';
import type { OpenMeteoDailyDay, OpenMeteoForecastResponse } from '../types/openmeteo';

export type { CurrentWeatherData } from '../types/weather';
export type { ForecastItem, ForecastResponse } from '../types/forecast';
export type { ApiLang } from '../types/api';
export type { GeoLocation } from '../types/geo';
export type { OpenMeteoDailyDay } from '../types/openmeteo';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;

if (!API_KEY) {
  console.error(
    '[weatherApi] VITE_OPENWEATHER_API_KEY is not set.\n' +
    'Please rename OPENWEATHER_API_KEY to VITE_OPENWEATHER_API_KEY in your .env.local file.'
  );
}

const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
});

const geoClient = axios.create({
  baseURL: 'https://api.openweathermap.org/geo/1.0',
  timeout: 10000,
});

const openMeteoClient = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
});

export function toApiLang(i18nLang: string): ApiLang {
  return i18nLang === 'zh-TW' ? 'zh_tw' : 'en';
}

/** Pick the best localized city name from a geocoding result. */
export function getLocalName(geo: GeoLocation, i18nLang: string): string {
  const code = i18nLang === 'zh-TW' ? 'zh' : 'en';
  return geo.local_names?.[code] ?? geo.local_names?.['en'] ?? geo.name;
}

/**
 * Convert a city name (any language) to coordinates.
 * Returns null if no matching city is found.
 */
export async function geocodeCity(city: string): Promise<GeoLocation | null> {
  const { data } = await geoClient.get<GeoLocation[]>('/direct', {
    params: { q: city, limit: 1, appid: API_KEY },
  });
  return data[0] ?? null;
}

/**
 * Convert coordinates to a GeoLocation (reverse geocoding).
 * Returns null if no result is found.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation | null> {
  const { data } = await geoClient.get<GeoLocation[]>('/reverse', {
    params: { lat, lon, limit: 1, appid: API_KEY },
  });
  return data[0] ?? null;
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  lang: ApiLang
): Promise<CurrentWeatherData> {
  const { data } = await weatherClient.get<CurrentWeatherData>('/weather', {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang },
  });
  return data;
}

export async function fetchForecast(
  lat: number,
  lon: number,
  lang: ApiLang
): Promise<ForecastResponse> {
  const { data } = await weatherClient.get<ForecastResponse>('/forecast', {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang },
  });
  return data;
}

/** Fetch daily forecast from Open-Meteo (free, no key, up to 16 days). */
export async function fetchOpenMeteoForecast(lat: number, lon: number): Promise<OpenMeteoDailyDay[]> {
  const { data } = await openMeteoClient.get<OpenMeteoForecastResponse>('/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      daily: 'temperature_2m_max,temperature_2m_min,weathercode',
      forecast_days: 16,
      timezone: 'auto',
    },
  });
  return data.daily.time.map((date, i) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    weatherCode: data.daily.weathercode[i],
  }));
}

/** Map WMO weather code (Open-Meteo) to an emoji. */
export function wmoToEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '❄️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}

export function reduceForecastToDailyList(list: ForecastItem[]): ForecastItem[] {
  const seen = new Set<string>();
  const result: ForecastItem[] = [];
  for (const item of list) {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!seen.has(date)) {
      seen.add(date);
      result.push(item);
    }
    if (result.length === 5) break;
  }
  return result;
}

/** Map OpenWeather condition id to a weather emoji */
export function weatherEmoji(id: number): string {
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌧️';
  if (id >= 500 && id < 600) {
    if (id === 511) return '🌨️';
    return id < 502 ? '🌦️' : '🌧️';
  }
  if (id >= 600 && id < 700) return '❄️';
  if (id >= 700 && id < 800) return '🌫️';
  if (id === 800) return '☀️';
  if (id === 801) return '🌤️';
  if (id === 802) return '⛅';
  if (id >= 803) return '☁️';
  return '🌡️';
}
