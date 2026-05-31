import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import type { CurrentWeatherData } from '../types/weather';
import type { OpenMeteoDailyDay } from '../types/openmeteo';
import type { GeoLocation } from '../types/geo';
import {
  geocodeCity,
  reverseGeocode,
  fetchCurrentWeather,
  fetchOpenMeteoForecast,
  toApiLang,
  getLocalName,
} from '../services/weatherApi';
import { useTheme } from '../hooks/useTheme';

import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ForecastStrip } from '../components/ForecastStrip';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorBanner } from '../components/ErrorBanner';

interface Coords {
  lat: number;
  lon: number;
}

export default function IndexPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isDark, setIsDark } = useTheme();

  const [searchInput, setSearchInput] = useState('');
  const [city, setCity] = useState('Taipei');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geo, setGeo] = useState<GeoLocation | null>(null);
  const [weather, setWeather] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<OpenMeteoDailyDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (cityName: string, lang = i18n.language) => {
      const trimmed = cityName.trim();
      if (!trimmed) return;
      setLoading(true);
      setError(null);
      const apiLang = toApiLang(lang);
      try {
        const geoResult = await geocodeCity(trimmed);
        if (!geoResult) {
          setError(t('error.cityNotFound'));
          return;
        }
        const [weatherData, forecastData] = await Promise.all([
          fetchCurrentWeather(geoResult.lat, geoResult.lon, apiLang),
          fetchOpenMeteoForecast(geoResult.lat, geoResult.lon),
        ]);
        setWeather({ ...weatherData, name: getLocalName(geoResult, lang) });
        setForecast(forecastData);
        setCoords({ lat: geoResult.lat, lon: geoResult.lon });
        setGeo(geoResult);
        setCity(trimmed);
        setSearchParams({ city: trimmed }, { replace: false });
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && !err.response) {
          setError(t('error.networkError'));
        } else {
          setError(t('error.apiError'));
        }
      } finally {
        setLoading(false);
      }
    },
    [i18n.language, t, setSearchParams]
  );

  // Re-fetch current weather with new language (forecast is language-neutral)
  const handleRefetchByLang = useCallback(
    async (lang: string) => {
      if (!coords) return;
      setLoading(true);
      setError(null);
      const apiLang = toApiLang(lang);
      try {
        const weatherData = await fetchCurrentWeather(coords.lat, coords.lon, apiLang);
        const name = geo ? getLocalName(geo, lang) : weatherData.name;
        setWeather({ ...weatherData, name });
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && !err.response) {
          setError(t('error.networkError'));
        } else {
          setError(t('error.apiError'));
        }
      } finally {
        setLoading(false);
      }
    },
    [coords, geo, t]
  );

  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const cityFromUrl = searchParams.get('city');
    if (cityFromUrl) {
      handleSearch(cityFromUrl);
      return;
    }

    if (!navigator.geolocation) {
      handleSearch('Taipei');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const geoResult = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          handleSearch(geoResult ? (geoResult.local_names?.en ?? geoResult.name) : 'Taipei');
        } catch {
          handleSearch('Taipei');
        }
      },
      () => handleSearch('Taipei'),
      { timeout: 8000, maximumAge: 300_000 },
    );
  }, [handleSearch, searchParams]);

  const handleLanguageToggle = useCallback(() => {
    const next = i18n.language === 'zh-TW' ? 'en' : 'zh-TW';
    i18n.changeLanguage(next);
    handleRefetchByLang(next);
  }, [i18n, handleRefetchByLang]);

  const cityForMonthly = searchParams.get('city') ?? city;

  return (
    <div className="min-h-screen bg-wx-base">
      {/* decorative background layer */}
      <div className="wx-dot-grid" aria-hidden="true" />
      <div className="wx-orb wx-orb-1" aria-hidden="true" />
      <div className="wx-orb wx-orb-2" aria-hidden="true" />

      <div className="wx-page-content">
        <Header
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          isDark={isDark}
          onThemeToggle={() => setIsDark(prev => !prev)}
          language={i18n.language}
          onLanguageToggle={handleLanguageToggle}
        />

        <main className="max-w-5xl mx-auto px-6 py-6">
          {loading && <LoadingOverlay />}

          {!loading && error && (
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          )}

          {!loading && weather && (
            <HeroSection key={city} weather={weather} />
          )}

          {!loading && forecast.length > 0 && (
            <ForecastStrip forecast={forecast} />
          )}

          {!loading && forecast.length > 0 && (
            <div className="animate-fade-in-up delay-780 mt-6 flex justify-center">
              <Link
                to={`/monthly?city=${encodeURIComponent(cityForMonthly)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-wx hover:border-wx-accent text-wx-muted hover:text-wx-accent font-body text-sm tracking-wide transition-colors duration-200"
              >
                <span className="text-base leading-none">☁</span>
                {t('monthly.viewMonthly')}
              </Link>
            </div>
          )}

          {!loading && !weather && !error && (
            <div className="animate-fade-in-up mt-20 text-center">
              <p className="text-wx-muted font-body text-base">{t('weather.noData')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
