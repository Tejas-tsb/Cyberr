import { GeolocData } from '../types';

export function isValidIp(ip: string): boolean {
  const trimmed = ip.trim();
  if (!trimmed) return false;
  
  // Basic IPv4 regex
  const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // Basic IPv6 check
  const hasColon = trimmed.includes(':');
  if (hasColon) {
    // Basic structural validation for IPv6
    return trimmed.split(':').length >= 3 && /^[0-9a-fA-F:]+$/.test(trimmed);
  }
  
  return ipv4Regex.test(trimmed);
}

function parseIpwhois(data: any): GeolocData {
  return {
    ip: data.ip,
    type: data.type || (data.ip.includes(':') ? 'IPv6' : 'IPv4'),
    country: data.country || 'Unknown',
    countryCode: data.country_code || 'US',
    countryFlag: data.country_flag || `https://flagcdn.com/${(data.country_code || 'us').toLowerCase()}.svg`,
    city: data.city || 'Unknown',
    region: data.region || 'Unknown',
    timezone: data.timezone?.id || 'UTC',
    utcOffset: data.timezone?.utc || '+00:00',
    isp: data.connection?.isp || data.isp || 'Unknown Ext Provider',
    asn: data.connection?.asn ? `AS${data.connection.asn}` : 'Unknown',
    org: data.connection?.org || data.org || 'Unknown Org',
    latitude: typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude || '0'),
    longitude: typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude || '0'),
    currency: data.currency?.name || 'Unknown Currency',
    currencyCode: data.currency?.code || 'USD',
    callingCode: data.country_phone || '+1',
  };
}

function parseIpapi(data: any): GeolocData {
  return {
    ip: data.ip,
    type: data.ip.includes(':') ? 'IPv6' : 'IPv4',
    country: data.country_name || 'Unknown',
    countryCode: data.country || 'US',
    countryFlag: `https://flagcdn.com/${(data.country || 'us').toLowerCase()}.svg`,
    city: data.city || 'Unknown',
    region: data.region || 'Unknown',
    timezone: data.timezone || 'UTC',
    utcOffset: data.utc_offset || '+0000',
    isp: data.org || 'Unknown Ext Provider',
    asn: data.asn || 'Unknown',
    org: data.org || 'Unknown Org',
    latitude: typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude || '0'),
    longitude: typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude || '0'),
    currency: data.currency_name || 'Dollar',
    currencyCode: data.currency || 'USD',
    callingCode: data.country_calling_code || '+1',
  };
}

export async function fetchIpData(ip?: string): Promise<GeolocData> {
  const targetIp = ip ? ip.trim() : '';
  
  // Try IPWhois first (highly detailed and flag support)
  try {
    const url = targetIp ? `https://ipwho.is/${targetIp}` : 'https://ipwho.is/';
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    
    if (!response.ok) {
      throw new Error(`IPWhois returned HTTP status ${response.status}`);
    }
    
    const data = await response.json();
    if (data.success === false) {
      throw new Error(data.message || 'Invalid IP lookup response');
    }
    
    return parseIpwhois(data);
  } catch (error: any) {
    console.warn('IPWhois failed, falling back to ipapi.co:', error.message);
    
    // Fallback to ipapi.co
    try {
      const url = targetIp ? `https://ipapi.co/${targetIp}/json/` : 'https://ipapi.co/json/';
      const response = await fetch(url, { method: 'GET', mode: 'cors' });
      
      if (!response.ok) {
        throw new Error(`ipapi.co returned HTTP status ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.reason || 'IP Lookup failed at secondary API');
      }
      
      return parseIpapi(data);
    } catch (fallbackError: any) {
      console.error('All GeoIP APIs failed:', fallbackError.message);
      throw new Error(`Failed to resolve IP location: ${fallbackError.message}`);
    }
  }
}
