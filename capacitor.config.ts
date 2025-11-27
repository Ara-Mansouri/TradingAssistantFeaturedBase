import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tradingassistant.app',
  appName: 'Trading Assistant',
  webDir: 'out',
  server: {
  url: "https://trading-assistant-featured-base-d5e.vercel.app", 
  cleartext: false,      
      allowNavigation: [
    "trading-assistant-featured-base-d5e.vercel.app"
  ]        
  },

};

export default config;
