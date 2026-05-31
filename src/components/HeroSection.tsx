import { useTranslation } from 'react-i18next';
import type { CurrentWeatherData } from '../types/weather';
import { weatherEmoji } from '../services/weatherApi';

interface HeroSectionProps {
  weather: CurrentWeatherData;
}

export function HeroSection(props: HeroSectionProps) {
  const { weather } = props;
  const { name, sys, main, wind, weather: conditions, dt } = weather;
  const { t } = useTranslation();
  const condition = conditions[0];
  const emoji = weatherEmoji(condition.id);

  const updatedAt = new Date(dt * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section className="animate-fade-in-up delay-100">
      {/* Gradient border frame */}
      <div
        className="rounded-2xl p-px"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 55%, transparent) 0%, var(--color-border) 45%)',
        }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-wx-card">

          {/* Ambient gradient wash */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 80% at -5% 0%, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent 65%)',
            }}
          />

          {/* Watermark emoji */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none select-none"
            style={{
              right: '-4%',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 'clamp(11rem, 28vw, 20rem)',
              lineHeight: 1,
              opacity: 0.08,
              filter: 'blur(1.5px)',
            }}
          >
            {emoji}
          </div>

          <div className="relative p-6 md:p-8 lg:p-10">

            {/* ── Location + time row ── */}
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="live-dot" />
                <h1 className="font-bold font-body text-wx-base uppercase tracking-widest text-base md:text-lg truncate">
                  {name}
                </h1>
                <span className="section-label shrink-0">&middot;&nbsp;{sys.country}</span>
              </div>
              <span className="section-label tabular-nums shrink-0">{updatedAt}</span>
            </div>

            {/* ── Temperature + condition ── */}
            <div className="min-w-0 flex-1">
              <p className="animate-temp-reveal delay-200 temp-display leading-none">
                {Math.round(main.temp)}°
              </p>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-3">
                <p className="animate-fade-in-up delay-350 font-body text-wx-muted text-sm md:text-base capitalize tracking-wide">
                  {condition.description}
                </p>
                <div className="animate-fade-in delay-400 flex items-center gap-3">
                  <span className="section-label">
                    &#8593;&thinsp;{Math.round(main.temp_max)}°
                  </span>
                  <span className="section-label">
                    &#8595;&thinsp;{Math.round(main.temp_min)}°
                  </span>
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <hr className="rule-wx my-6" />

            {/* ── Stats grid ── */}
            <div className="animate-fade-in-up delay-400 grid grid-cols-3">
              <div className="pr-6">
                <span className="section-label">{t('weather.humidity')}</span>
                <p className="text-2xl font-bold font-body text-wx-base tabular-nums leading-tight mt-2">
                  {main.humidity}{t('weather.unitPercent')}
                </p>
              </div>
              <div className="px-6 border-x border-wx">
                <span className="section-label">{t('weather.windSpeed')}</span>
                <p className="text-2xl font-bold font-body text-wx-base tabular-nums leading-tight mt-2">
                  {wind.speed}&thinsp;{t('weather.unitWindMs')}
                </p>
              </div>
              <div className="pl-6">
                <span className="section-label">{t('weather.feelsLike')}</span>
                <p className="text-2xl font-bold font-body text-wx-base tabular-nums leading-tight mt-2">
                  {Math.round(main.feels_like)}{t('weather.unitCelsius')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
