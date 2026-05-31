import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import type { OpenMeteoDailyDay } from '../types/openmeteo';
import type { GeoLocation } from '../types/geo';
import {
  geocodeCity,
  fetchOpenMeteoForecast,
  getLocalName,
} from '../services/weatherApi';
import { useTheme } from '../hooks/useTheme';

import { Header } from '../components/Header';
import { MonthlyChart } from '../components/MonthlyChart';
import { MonthlyDayList } from '../components/MonthlyDayList';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorBanner } from '../components/ErrorBanner';

export default function MonthlyPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();

  const cityParam = searchParams.get('city');

  const [searchInput, setSearchInput] = useState(cityParam ?? '');
  const [forecast, setForecast] = useState<OpenMeteoDailyDay[]>([]);
  const [geo, setGeo] = useState<GeoLocation | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayDate = new Date().toISOString().slice(0, 10);

  // Fetch forecast when city param changes
  useEffect(() => {
    if (!cityParam) {
      navigate('/');
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const geoResult = await geocodeCity(cityParam!);
        if (cancelled) return;
        if (!geoResult) {
          setError(t('error.cityNotFound'));
          return;
        }
        const days = await fetchOpenMeteoForecast(geoResult.lat, geoResult.lon);
        if (cancelled) return;
        setForecast(days);
        setGeo(geoResult);
        setDisplayName(getLocalName(geoResult, i18n.language));
      } catch (err: unknown) {
        if (!cancelled) {
          if (axios.isAxiosError(err) && !err.response) {
            setError(t('error.networkError'));
          } else {
            setError(t('error.apiError'));
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [cityParam, navigate, t]);

  // Update display name when language changes without re-fetching
  useEffect(() => {
    if (geo) setDisplayName(getLocalName(geo, i18n.language));
  }, [geo, i18n.language]);

  const handleSearch = useCallback((cityName: string) => {
    const trimmed = cityName.trim();
    if (!trimmed) return;
    setSearchInput(trimmed);
    setSearchParams({ city: trimmed });
  }, [setSearchParams]);

  const handleLanguageToggle = useCallback(() => {
    const next = i18n.language === 'zh-TW' ? 'en' : 'zh-TW';
    i18n.changeLanguage(next);
  }, [i18n]);

  // Month label for the title
  const monthLabel = (() => {
    const now = new Date();
    if (i18n.language === 'zh-TW') {
      return `${now.getFullYear()}年${now.getMonth() + 1}月`;
    }
    return now.toLocaleString('en', { month: 'long', year: 'numeric' });
  })();

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

          {/* Back link */}
          <div className="animate-fade-in-down mb-5">
            <Link
              to={cityParam ? `/?city=${encodeURIComponent(cityParam)}` : '/'}
              className="inline-flex items-center gap-1.5 text-wx-muted hover:text-wx-accent font-body text-sm tracking-wide transition-colors duration-150"
            >
              <span className="font-mono text-base leading-none">←</span>
              {t('monthly.backToMain')}
            </Link>
          </div>

          {/* Page title */}
          {displayName && !loading && (
            <div className="animate-fade-in-up mb-6">
              <h1 className="font-display italic font-thin text-wx-base" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', lineHeight: 1.1 }}>
                {displayName}
              </h1>
              <p className="section-label mt-2">{monthLabel}&nbsp;·&nbsp;{t('monthly.subtitle')}</p>
            </div>
          )}

          {loading && <LoadingOverlay />}

          {!loading && error && (
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          )}

          {!loading && forecast.length > 0 && (
            <>
              {/* Chart card */}
              <div className="animate-fade-in-up delay-100 rounded-2xl p-px mb-4"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 50%, transparent) 0%, var(--color-border) 45%)',
                }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-wx-card">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 70% 80% at -5% 0%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 65%)',
                    }}
                  />
                  <div className="relative p-5 md:p-7">
                    <span className="section-label mb-4 block">{t('monthly.chartLabel')}</span>
                    <MonthlyChart days={forecast} todayDate={todayDate} />
                  </div>
                </div>
              </div>

              {/* Day list card */}
              <div className="animate-fade-in-up delay-200 rounded-2xl border border-wx bg-wx-card px-5 md:px-7">
                <MonthlyDayList days={forecast} todayDate={todayDate} />
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
