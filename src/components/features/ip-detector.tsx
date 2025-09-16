"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LocateFixed, Globe, Building, Wifi } from 'lucide-react';

interface IpInfo {
  query: string;
  country: string;
  city: string;
  regionName: string;
  isp: string;
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) => (
    <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
        <span className="font-mono text-foreground text-right">{value || '-'}</span>
    </div>
);


export default function IpDetector() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIpInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        // We use a timestamp to bypass browser cache for this request
        const response = await axios.get(`http://ip-api.com/json?_=${new Date().getTime()}`);
        if (response.data.status === 'success') {
          setIpInfo(response.data);
        } else {
          setError('اطلاعاتی یافت نشد.');
        }
      } catch (err) {
        setError('خطا در دریافت اطلاعات.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIpInfo();
  }, []);
  
  const maskIp = (ip: string | undefined) => {
    if (!ip) return '';
    const parts = ip.split('.');
    if (parts.length !== 4) return ip;
    return `${parts[0]}.${parts[1]}.***.${parts[3]}`;
  }

  return (
    <CardContent>
      {loading ? (
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
              </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
              </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
              </div>
          </div>
      ) : error ? (
        <div className="flex items-center justify-center text-destructive h-24 bg-destructive/10 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <InfoRow icon={<Wifi className="h-4 w-4" />} label="آدرس IP شما" value={maskIp(ipInfo?.query)} />
          <InfoRow icon={<Globe className="h-4 w-4" />} label="کشور" value={ipInfo?.country} />
          <InfoRow icon={<Building className="h-4 w-4" />} label="شهر" value={ipInfo?.city} />
          <InfoRow icon={<Building className="h-4 w-4" />} label="منطقه" value={ipInfo?.regionName} />
          <InfoRow icon={<Wifi className="h-4 w-4" />} label="سرویس‌دهنده" value={ipInfo?.isp} />
        </div>
      )}
    </CardContent>
  );
}
