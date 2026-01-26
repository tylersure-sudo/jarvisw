import type { LocationInfo } from '../types';

export async function getCurrentLocation(): Promise<LocationInfo> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // 尝试反向地理编码获取城市名称
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh-CN`
          );
          const data = await response.json();

          resolve({
            latitude,
            longitude,
            city: data.address?.city || data.address?.town || data.address?.village || '未知城市',
            country: data.address?.country || '未知国家',
          });
        } catch {
          // 即使反向地理编码失败，也返回坐标
          resolve({
            latitude,
            longitude,
            city: '未知城市',
            country: '未知国家',
          });
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('用户拒绝了位置请求'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('位置信息不可用'));
            break;
          case error.TIMEOUT:
            reject(new Error('获取位置超时'));
            break;
          default:
            reject(new Error('获取位置时发生未知错误'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5分钟缓存
      }
    );
  });
}
