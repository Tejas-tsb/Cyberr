export interface GeolocData {
  ip: string;
  type: string; // IPv4 or IPv6
  country: string;
  countryCode: string;
  countryFlag: string;
  city: string;
  region: string;
  timezone: string;
  utcOffset: string;
  isp: string;
  asn: string;
  org: string;
  latitude: number;
  longitude: number;
  currency: string;
  currencyCode: string;
  callingCode: string;
}

export interface SearchHistoryItem {
  id: string;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  timestamp: string;
}

export interface AnalyticsCountryStats {
  name: string;
  value: number;
}
