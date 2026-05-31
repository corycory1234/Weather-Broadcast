export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  local_names?: Record<string, string>;
}
