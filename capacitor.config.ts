import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tradingassistant.app',
  appName: 'Trading Assistant',
  server: {
  url: "https://trading-assistant-featured-base-d5e.vercel.app", 
  cleartext: true,              
  },
};

export default config;
