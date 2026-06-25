import { Capacitor } from '@capacitor/core';
import { Health } from '@capgo/capacitor-health';
import type { HealthDataType } from '@capgo/capacitor-health';

export interface HealthMetrics {
  steps: number;
  heartRate: number;
  sleepHours: number;
  hrv?: number;
  spo2?: number;
  bodyTemperature?: number;
  respirationRate?: number;
  foundCount?: number;
}

export const HealthService = {
  async isAvailable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const result = await Health.isAvailable();
      return result.available;
    } catch {
      return false;
    }
  },

  async requestPermissions(): Promise<{ granted: boolean; message?: string }> {
    if (!Capacitor.isNativePlatform()) {
      return { granted: true };
    }
    const available = await this.isAvailable();
    if (!available) {
      return { granted: false, message: 'Google Fit не найден на устройстве' };
    }
    try {
      const readTypes: HealthDataType[] = [
        'steps',
        'restingHeartRate',
        'heartRate',
        'oxygenSaturation',
        'bodyTemperature',
        'respiratoryRate',
      ];
      const status = await Health.requestAuthorization({
        read: readTypes,
        write: [],
      });
      return { granted: status.readAuthorized.length > 0 };
    } catch (error) {
      console.error('Health permission error:', error);
      return { granted: false, message: 'Ошибка при запросе разрешений' };
    }
  },

  async fetchCurrentMetrics(): Promise<HealthMetrics> {
    if (!Capacitor.isNativePlatform()) {
      return {
        steps: Math.floor(Math.random() * 4000) + 3000,
        heartRate: Math.floor(Math.random() * 25) + 65,
        sleepHours: parseFloat((Math.random() * 3 + 5).toFixed(1)),
        hrv: Math.floor(Math.random() * 40) + 40,
        spo2: Math.floor(Math.random() * 3) + 97,
        bodyTemperature: parseFloat((Math.random() * 0.6 + 36.2).toFixed(1)),
        respirationRate: Math.floor(Math.random() * 6) + 12,
      };
    }

    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startDate = sevenDaysAgo.toISOString();
      const endDate = now.toISOString();

      const [stepsResult, heartRateResult, spo2Result, tempResult, respResult] = await Promise.allSettled([
        Health.readSamples({ dataType: 'steps', startDate, endDate, limit: 10000 }),
        Health.readSamples({ dataType: 'restingHeartRate', startDate, endDate, limit: 100 }),
        Health.readSamples({ dataType: 'oxygenSaturation', startDate, endDate, limit: 100 }),
        Health.readSamples({ dataType: 'bodyTemperature', startDate, endDate, limit: 100 }),
        Health.readSamples({ dataType: 'respiratoryRate', startDate, endDate, limit: 100 }),
      ]);

      let steps = 0;
      let heartRate = 72;
      let spo2: number | undefined;
      let bodyTemperature: number | undefined;
      let respirationRate: number | undefined;
      let foundCount = 0;

      if (stepsResult.status === 'fulfilled') {
        steps = stepsResult.value.samples.reduce((sum, s) => sum + s.value, 0);
        if (steps > 0) foundCount++;
      }

      if (heartRateResult.status === 'fulfilled') {
        const samples = heartRateResult.value.samples;
        if (samples.length > 0) {
          heartRate = samples[samples.length - 1].value;
          foundCount++;
        }
      }

      if (spo2Result.status === 'fulfilled') {
        const samples = spo2Result.value.samples;
        if (samples.length > 0) {
          spo2 = samples[samples.length - 1].value;
          foundCount++;
        }
      }

      if (tempResult.status === 'fulfilled') {
        const samples = tempResult.value.samples;
        if (samples.length > 0) {
          bodyTemperature = samples[samples.length - 1].value;
          foundCount++;
        }
      }

      if (respResult.status === 'fulfilled') {
        const samples = respResult.value.samples;
        if (samples.length > 0) {
          respirationRate = samples[samples.length - 1].value;
          foundCount++;
        }
      }

      return { steps, heartRate, sleepHours: 0, hrv: 0, spo2, bodyTemperature, respirationRate: respirationRate ?? 0, foundCount };
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return { steps: 0, heartRate: 72, sleepHours: 0, respirationRate: 0, foundCount: 0 };
    }
  },

  async syncWithBackend(userId: string, metrics: HealthMetrics) {
    try {
      const response = await fetch('/api/sync-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, metrics, timestamp: new Date().toISOString() }),
      });
      return await response.json();
    } catch (e) {
      console.error('Error syncing health data:', e);
    }
  },
};
