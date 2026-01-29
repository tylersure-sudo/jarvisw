import Taro from '@tarojs/taro';
import type { LocationInfo } from '../types';

export async function getCurrentLocation(): Promise<LocationInfo> {
  try {
    const res = await Taro.getLocation({
      type: 'gcj02',
    });

    const { latitude, longitude } = res;

    // 尝试反向地理编码获取城市名称
    try {
      const geoRes = await Taro.request({
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh-CN`,
        method: 'GET',
      });

      const data = geoRes.data as any;
      return {
        latitude,
        longitude,
        city: data.address?.city || data.address?.town || data.address?.village || '未知城市',
        country: data.address?.country || '未知国家',
      };
    } catch {
      return {
        latitude,
        longitude,
        city: '未知城市',
        country: '未知国家',
      };
    }
  } catch (error) {
    console.error('获取位置失败:', error);
    throw new Error('获取位置失败');
  }
}
