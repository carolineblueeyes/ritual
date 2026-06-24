import { Capacitor } from '@capacitor/core';
import { HealthConnect } from 'capacitor-health-connect';
import type { RecordType, TimeRangeFilter, StoredRecord } from 'capacitor-health-connect';

export interface HealthMetrics {
  steps: number;
  heartRate: number;
  sleepHours: number;
  hrv?: number;
  spo2?: number;
  bodyTemperature?: number;
  respirationRate?: number;
}

function isRecordOfType(record: StoredRecord, type: RecordType): boolean {
  return record.type === type;
}

export const HealthService = {
  async isAvailable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const result = await HealthConnect.checkAvailability();
      return result.availability === 'Available';
    } catch {
      return false;
    }
  },

  async requestPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }
    try {
      const result = await HealthConnect.requestHealthPermissions({
        read: ['Steps', 'RestingHeartRate', 'HeartRateSeries', 'OxygenSaturation', 'BodyTemperature', 'RespiratoryRate'],
        write: [],
      });
      return result.hasAllPermissions;
    } catch (error) {
      console.error('Health Connect permission error:', error);
      return false;
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
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const timeRangeFilter: TimeRangeFilter = {
        type: 'between',
        startTime: startOfDay,
        endTime: now,
      };

      const [stepsResult, heartRateResult, spo2Result, tempResult] = await Promise.allSettled([
        HealthConnect.readRecords({ type: 'Steps', timeRangeFilter }),
        HealthConnect.readRecords({ type: 'RestingHeartRate', timeRangeFilter }),
        HealthConnect.readRecords({ type: 'OxygenSaturation', timeRangeFilter }),
        HealthConnect.readRecords({ type: 'BodyTemperature', timeRangeFilter }),
      ]);

      let steps = 0;
      let heartRate = 72;
      let spo2: number | undefined;
      let bodyTemperature: number | undefined;

      if (stepsResult.status === 'fulfilled') {
        const stepsRecords = stepsResult.value.records.filter(r => isRecordOfType(r, 'Steps'));
        steps = stepsRecords.reduce((sum, r) => {
          if (r.type === 'Steps') return sum + (r.count || 0);
          return sum;
        }, 0);
      }

      if (heartRateResult.status === 'fulfilled') {
        const hrRecords = heartRateResult.value.records.filter(r => isRecordOfType(r, 'RestingHeartRate'));
        if (hrRecords.length > 0) {
          const latest = hrRecords[hrRecords.length - 1];
          if (latest.type === 'RestingHeartRate') {
            heartRate = latest.beatsPerMinute;
          }
        }
      }

      if (spo2Result.status === 'fulfilled') {
        const spo2Records = spo2Result.value.records.filter(r => isRecordOfType(r, 'OxygenSaturation'));
        if (spo2Records.length > 0) {
          const latest = spo2Records[spo2Records.length - 1];
          if (latest.type === 'OxygenSaturation') {
            spo2 = latest.percentage.value;
          }
        }
      }

      if (tempResult.status === 'fulfilled') {
        const tempRecords = tempResult.value.records.filter(r => isRecordOfType(r, 'BodyTemperature'));
        if (tempRecords.length > 0) {
          const latest = tempRecords[tempRecords.length - 1];
          if (latest.type === 'BodyTemperature') {
            bodyTemperature = latest.temperature.value;
          }
        }
      }

      return { steps, heartRate, sleepHours: 0, hrv: 0, spo2, bodyTemperature, respirationRate: 0 };
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return { steps: 0, heartRate: 72, sleepHours: 0, respirationRate: 0 };
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
