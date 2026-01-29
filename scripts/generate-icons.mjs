/**
 * 生成 iOS 和 Android 所需的各尺寸应用图标
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// 深空宇宙主题的 SVG 图标
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1a0533"/>
      <stop offset="60%" stop-color="#0a0118"/>
      <stop offset="100%" stop-color="#030208"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="35%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#7c3aed" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="core" cx="50%" cy="45%" r="15%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#c4b5fd" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" rx="200" fill="url(#bg)"/>
  <!-- Stars -->
  <circle cx="180" cy="150" r="2" fill="white" opacity="0.8"/>
  <circle cx="850" cy="200" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="300" cy="800" r="2" fill="white" opacity="0.7"/>
  <circle cx="750" cy="750" r="1.5" fill="white" opacity="0.5"/>
  <circle cx="150" cy="500" r="1" fill="white" opacity="0.4"/>
  <circle cx="900" cy="550" r="2" fill="white" opacity="0.6"/>
  <circle cx="500" cy="100" r="1.5" fill="white" opacity="0.5"/>
  <circle cx="650" cy="900" r="1" fill="white" opacity="0.4"/>
  <circle cx="100" cy="300" r="1.5" fill="#c4b5fd" opacity="0.3"/>
  <circle cx="920" cy="400" r="1" fill="#c4b5fd" opacity="0.3"/>
  <!-- Glow -->
  <circle cx="512" cy="460" r="360" fill="url(#glow)"/>
  <!-- Spiral galaxy -->
  <ellipse cx="512" cy="460" rx="200" ry="80" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.3" transform="rotate(-20, 512, 460)"/>
  <ellipse cx="512" cy="460" rx="150" ry="60" fill="none" stroke="#c4b5fd" stroke-width="1.5" opacity="0.4" transform="rotate(-20, 512, 460)"/>
  <ellipse cx="512" cy="460" rx="100" ry="40" fill="none" stroke="#ddd6fe" stroke-width="1" opacity="0.5" transform="rotate(-20, 512, 460)"/>
  <!-- Core -->
  <circle cx="512" cy="460" r="60" fill="url(#core)"/>
  <!-- Text -->
  <text x="512" y="680" text-anchor="middle" font-family="serif" font-size="72" fill="#e9d5ff" opacity="0.9" letter-spacing="16">灵感回响</text>
  <text x="512" y="740" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#c4b5fd" opacity="0.6" letter-spacing="8">COSMIC ECHO</text>
</svg>`;

const buf = Buffer.from(iconSvg);

// iOS: 1024x1024
const iosDir = join('ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
await sharp(buf).resize(1024, 1024).png().toFile(join(iosDir, 'AppIcon-512@2x.png'));
console.log('✅ iOS 1024x1024 icon generated');

// Android mipmap sizes
const androidSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

for (const [dir, size] of Object.entries(androidSizes)) {
  const outDir = join('android', 'app', 'src', 'main', 'res', dir);
  await sharp(buf).resize(size, size).png().toFile(join(outDir, 'ic_launcher.png'));
  await sharp(buf).resize(size, size).png().toFile(join(outDir, 'ic_launcher_round.png'));
  // Foreground (slightly larger for adaptive icon)
  const fgSize = Math.round(size * 1.5);
  await sharp(buf).resize(fgSize, fgSize).png().toFile(join(outDir, 'ic_launcher_foreground.png'));
  console.log(`✅ Android ${dir} (${size}px) icons generated`);
}

// PWA icons
const pwaDir = join('public', 'icons');
await sharp(buf).resize(192, 192).png().toFile(join(pwaDir, 'icon-192.png'));
await sharp(buf).resize(512, 512).png().toFile(join(pwaDir, 'icon-512.png'));
console.log('✅ PWA icons generated (192, 512)');

// Splash screens for Android (simple centered icon on dark bg)
const splashSizes = {
  'drawable': { w: 480, h: 800 },
  'drawable-port-mdpi': { w: 320, h: 480 },
  'drawable-port-hdpi': { w: 480, h: 800 },
  'drawable-port-xhdpi': { w: 720, h: 1280 },
  'drawable-port-xxhdpi': { w: 960, h: 1600 },
  'drawable-port-xxxhdpi': { w: 1280, h: 1920 },
  'drawable-land-mdpi': { w: 480, h: 320 },
  'drawable-land-hdpi': { w: 800, h: 480 },
  'drawable-land-xhdpi': { w: 1280, h: 720 },
  'drawable-land-xxhdpi': { w: 1600, h: 960 },
  'drawable-land-xxxhdpi': { w: 1920, h: 1280 },
};

for (const [dir, { w, h }] of Object.entries(splashSizes)) {
  const iconSize = Math.min(w, h) * 0.4;
  const iconBuf = await sharp(buf).resize(Math.round(iconSize), Math.round(iconSize)).png().toBuffer();
  const splash = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 3, g: 2, b: 8, alpha: 1 } }
  })
    .composite([{
      input: iconBuf,
      gravity: 'centre',
    }])
    .png()
    .toBuffer();

  const outPath = join('android', 'app', 'src', 'main', 'res', dir, 'splash.png');
  writeFileSync(outPath, splash);
  console.log(`✅ Android splash ${dir} (${w}x${h})`);
}

// iOS splash
const iosSplashDir = join('ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');
const iosSplashSize = 2732;
const iosIconSize = Math.round(iosSplashSize * 0.25);
const iosIconBuf = await sharp(buf).resize(iosIconSize, iosIconSize).png().toBuffer();
const iosSplash = await sharp({
  create: { width: iosSplashSize, height: iosSplashSize, channels: 4, background: { r: 3, g: 2, b: 8, alpha: 1 } }
})
  .composite([{ input: iosIconBuf, gravity: 'centre' }])
  .png()
  .toBuffer();

for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
  writeFileSync(join(iosSplashDir, name), iosSplash);
}
console.log('✅ iOS splash screens generated');

console.log('\n🎉 All icons and splash screens generated!');
