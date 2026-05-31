export interface CurrentWeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: { speed: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  dt: number;
}
