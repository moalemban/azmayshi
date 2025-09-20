"use client";

import { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LocateFixed, Globe, Building, Wifi, MapPin, Clock, Mailbox, Binary } from 'lucide-react';

interface IpInfo {
  ipAddress: string;
  ipType: 'IPv4' | 'IPv6' | 'نامشخص';
  ipv4?: string;
  country: string;
  region: string;
  city: string;
  lat?: number;
  lon?: number;
  isp: string;
  org?: string;
  timezone: string;
  postal: string;
}

const InfoRow = ({ icon, label, value, monospace = true }: { icon: React.ReactNode, label: string, value: string | undefined, monospace?: boolean }) => (
    <div className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-b-0">
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
        <span className={`${monospace ? 'font-mono' : 'font-sans'} text-foreground text-right`}>{value || '---'}</span>
    </div>
);

const fetchWithFallback = async (urls: string[]) => {
    for (const url of urls) {
        try {
            const response = await fetch(url, { headers: { 'Accept': 'application/json' }});
            if (!response.ok) throw new Error(`Status ${response.status}`);
            const data = await response.json();
            // Simple validation to ensure we got a useful response
            if (data.ip || data.query || data.ipAddress) {
                return data;
            }
            throw new Error('Invalid data structure');
        } catch (error: any) {
            console.warn(`Failed from ${url}:`, error.message);
        }
    }
    throw new Error('All IP fetch attempts failed.');
}


export default function IpDetector() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIpInfo = async () => {
      setLoading(true);
      setError(null);
      
       const ipApiUrls = [
            'https://my-ip-api.haj-taheri19.workers.dev/',
            'https://ip-api.com/json/?fields=status,message,country,regionName,city,lat,lon,timezone,isp,org,query',
            'https://freeipapi.com/api/json/',
            'https://ipinfo.io/json',
            'https://ipapi.co/json/'
        ];
      
      try {
        const data = await fetchWithFallback(ipApiUrls);
        
        const ipAddress = data.ip || data.query || data.ipAddress;
        const ipType = ipAddress.includes(':') ? 'IPv6' : 'IPv4';
        
        let ipv4Address;
        if (ipType === 'IPv6') {
             try {
                const ipv4Res = await fetch('https://api.ipify.org?format=json');
                if (ipv4Res.ok) {
                    const ipv4Data = await ipv4Res.json();
                    ipv4Address = ipv4Data.ip;
                }
            } catch (e) {
                console.warn("Could not fetch IPv4 address:", e);
            }
        }
        
        const isp = data.isp || data.company?.name || '';
        const org = data.org || '';

        setIpInfo({
          ipAddress: ipAddress,
          ipType: ipType,
          ipv4: ipv4Address,
          country: data.country || data.country_name || data.countryName || '',
          region: data.regionName || data.region || '',
          city: data.city || data.cityName || '',
          lat: data.lat || data.latitude,
          lon: data.lon || data.longitude,
          isp: (isp && org && isp.toLowerCase() !== org.toLowerCase()) ? `${isp} (${org})` : (isp || org || ''),
          timezone: data.timezone || data.timeZone || '',
          postal: data.postal || data.postal_code || data.zipCode || '',
        });
        
      } catch (err) {
        setError('خطا در دریافت اطلاعات. لطفا لحظاتی بعد مجددا تلاش کنید.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIpInfo();
  }, []);

  return (
    <CardContent>
      {loading ? (
          <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
              ))}
          </div>
      ) : error ? (
        <div className="flex items-center justify-center text-destructive h-24 bg-destructive/10 rounded-lg">
          <p>{error}</p>
        </div>
      ) : ipInfo ? (
        <div className="space-y-2">
          <InfoRow icon={<Wifi className="h-4 w-4" />} label="آدرس IP شما" value={ipInfo.ipAddress} />
          <InfoRow icon={<Binary className="h-4 w-4" />} label="نوع IP" value={ipInfo.ipType} monospace={false}/>
          {ipInfo.ipv4 && <InfoRow icon={<Wifi className="h-4 w-4" />} label="آدرس IPv4" value={ipInfo.ipv4} />}
          <InfoRow icon={<Globe className="h-4 w-4" />} label="کشور" value={ipInfo.country} monospace={false}/>
          <InfoRow icon={<Building className="h-4 w-4" />} label="استان / شهر" value={`${ipInfo.region}, ${ipInfo.city}`} monospace={false}/>
          <InfoRow icon={<MapPin className="h-4 w-4" />} label="مختصات" value={ipInfo.lat && ipInfo.lon ? `${ipInfo.lat.toFixed(4)}, ${ipInfo.lon.toFixed(4)}` : undefined}/>
          <InfoRow icon={<Building className="h-4 w-4" />} label="سرویس‌دهنده (ISP)" value={ipInfo.isp} monospace={false}/>
          <InfoRow icon={<Clock className="h-4 w-4" />} label="منطقه زمانی" value={ipInfo.timezone} />
          <InfoRow icon={<Mailbox className="h-4 w-4" />} label="کد پستی" value={ipInfo.postal} />
        </div>
      ) : null}
    </CardContent>
  );
}
