export default function Head() {
  return (
    <>
      {/* PWA manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Icons */}
      <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      <link rel="icon" href="/icons/icon-192.png" />

      {/* iOS PWA settings */}
      <meta name="apple-mobile-web-app-title" content="Trading Assistant" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* PWA theme */}
      <meta name="theme-color" content="#ff0000" />
    </>
  );
}
