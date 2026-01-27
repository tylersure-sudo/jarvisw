import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cosmicecho.lingganhuixiang',
  appName: '灵感回响',
  webDir: 'dist',
  // iOS 配置
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#030208',
    scheme: 'lingganhuixiang',
  },
  // Android 配置
  android: {
    backgroundColor: '#030208',
    allowMixedContent: true,
  },
  // 服务器配置
  server: {
    androidScheme: 'https',
    iosScheme: 'lingganhuixiang',
  },
  // 插件配置
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#030208',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
