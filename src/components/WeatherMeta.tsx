import { useTranslation } from 'react-i18next';

interface WeatherMetaProps {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

interface MetaItemProps {
  label: string;
  value: string;
  position: 'left' | 'center' | 'right';
}

function MetaItem(props: MetaItemProps) {
  const { label, value, position } = props;
  const paddingClass =
    position === 'left'   ? 'pr-6' :
    position === 'center' ? 'px-6 border-x border-wx' :
                            'pl-6';
  return (
    <div className={paddingClass}>
      <span className="section-label mb-2">{label}</span>
      <p className="text-2xl font-bold font-body text-wx-base tabular-nums leading-tight">
        {value}
      </p>
    </div>
  );
}

export function WeatherMeta(props: WeatherMetaProps) {
  const { humidity, windSpeed, feelsLike } = props;
  const { t } = useTranslation();

  return (
    <>
      <div className="animate-fade-in-up delay-400 grid grid-cols-3 py-5">
        <MetaItem position="left"   label={t('weather.humidity')}  value={`${humidity}${t('weather.unitPercent')}`} />
        <MetaItem position="center" label={t('weather.windSpeed')} value={`${windSpeed} ${t('weather.unitWindMs')}`} />
        <MetaItem position="right"  label={t('weather.feelsLike')} value={`${Math.round(feelsLike)}${t('weather.unitCelsius')}`} />
      </div>
      <hr className="rule-wx" />
    </>
  );
}
