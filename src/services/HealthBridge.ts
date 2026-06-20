import { HealthData } from './HealthService';

/**
 * HealthBridge — работает только на нативных устройствах.
 * Использует cordova-plugin-health для доступа к Health API.
 * В браузере initialize() вернёт false.
 */
class HealthBridge {
  private isNative: boolean;
  private healthPlugin: any = null;

  constructor() {
    this.isNative = typeof (window as any).Capacitor !== 'undefined' && 
                    (window as any).Capacitor.isNativePlatform();
  }

  async initialize(): Promise<boolean> {
    if (!this.isNative) {
      return false;
    }

    const getPlugin = () =>
      (window as any).health ||
      (window as any).cordova?.plugins?.health ||
      null;

    return new Promise((resolve) => {
      const check = () => {
        const plugin = getPlugin();
        if (plugin) {
          this.healthPlugin = plugin;
          resolve(true);
        } else {
          setTimeout(check, 200);
        }
      };

      const plugin = getPlugin();
      if (plugin) {
        this.healthPlugin = plugin;
        resolve(true);
      } else {
        document.addEventListener('deviceready', check, { once: true });
        setTimeout(() => {
          if (!this.healthPlugin) {
            console.warn('[HealthBridge] Plugin not loaded after 5s');
            resolve(false);
          }
        }, 5000);
      }
    });
  }

  async isAvailable(): Promise<boolean> {
    if (!this.healthPlugin) {
      return false;
    }
    return new Promise((resolve) => {
      try {
        this.healthPlugin.isAvailable(
          (available: boolean) => {
            resolve(available);
          },
          () => {
            resolve(false);
          }
        );
      } catch {
        resolve(false);
      }
    });
  }

  async requestPermissions(): Promise<boolean> {
    if (!this.healthPlugin) {
      return false;
    }

    return new Promise((resolve, reject) => {
      this.healthPlugin.requestAuthorization(
        {
          read: [
            'steps', 'distance', 'calories', 'heart_rate',
            'sleep'
          ],
          write: []
        },
        () => {
          console.log('[HealthBridge] Permissions granted');
          resolve(true);
        },
        (err: any) => {
          console.warn('[HealthBridge] Permissions denied:', err);
          reject(new Error(String(err)));
        }
      );
    });
  }

  async getHealthData(): Promise<HealthData> {
    if (!this.healthPlugin) {
      throw new Error('Health plugin not available');
    }

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const queryType = (type: string): Promise<any> =>
      new Promise((resolve) => {
        const timer = setTimeout(() => {
          console.warn(`[HealthBridge] Query timeout for ${type}`);
          resolve(null);
        }, 4000);
        try {
          this.healthPlugin.queryAggregated(
            { startDate: startOfDay, endDate: endOfDay, dataType: type },
            (data: any) => { clearTimeout(timer); resolve(data); },
            () => { clearTimeout(timer); resolve(null); }
          );
        } catch {
          clearTimeout(timer);
          resolve(null);
        }
      });

    const [steps, calories, heartRate, sleep, distance] =
      await Promise.all([
        queryType('steps'),
        queryType('calories'),
        queryType('heart_rate'),
        queryType('sleep'),
        queryType('distance'),
      ]);

    console.log('[HealthBridge] Aggregated data:', {
      steps, calories, heartRate, sleep, distance,
    });

    return this.parseHealthData({
      steps, calories, heart_rate: heartRate, sleep, distance,
    });
  }

  private parseHealthData(raw: any): HealthData {
    const extract = (obj: any): number | null => {
      if (!obj) return null;
      const v = obj.value;
      if (v === null || v === undefined) return null;
      if (typeof v === 'number') return v;
      if (typeof v === 'object' && v.average !== undefined) return v.average;
      return null;
    };

    const heartRate = extract(raw.heart_rate) ?? extract(raw.resting_heart_rate) ?? 0;
    const hrv = 0;
    const steps = extract(raw.steps) ?? 0;
    const sleepSec = extract(raw.sleep);
    const sleepHours = sleepSec !== null ? sleepSec / 3600 : 0;

    return {
      hrv,
      heartRate,
      steps: Math.round(steps),
      sleepHours: parseFloat(sleepHours.toFixed(1)),
      sleepQuality: 0,
      stressLevel: this.estimateStressLevel(hrv, heartRate),
      activityCalories: Math.round(extract(raw.calories) ?? 0),
      respiratoryRate: 0,
    };
  }

  private estimateStressLevel(hrv: number, heartRate: number): number {
    if (hrv === 0 && heartRate === 0) return 0;
    if (hrv < 30 && heartRate > 80) return 75;
    if (hrv < 50 && heartRate > 75) return 50;
    return 30;
  }
}

export const healthBridge = new HealthBridge();