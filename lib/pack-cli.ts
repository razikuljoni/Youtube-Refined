import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { getAllExtensionFiles, generateIconSvg } from './extension-packager';

async function pack() {
  console.log('📦 Packaging YouTube Refined Chrome Extension (Manifest V3)...');
  
  const zip = new JSZip();
  const files = getAllExtensionFiles();

  files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  const svgIcon = generateIconSvg();
  zip.file('icons/icon16.png', svgIcon);
  zip.file('icons/icon48.png', svgIcon);
  zip.file('icons/icon128.png', svgIcon);
  zip.file('icons/icon.svg', svgIcon);

  const outDir = path.resolve(process.cwd(), 'dist-extension');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const zipPath = path.join(outDir, 'youtube-refined-extension.zip');
  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(zipPath, buffer);

  console.log(`✅ Success! Extension package generated at:\n   ${zipPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
  console.log('🚀 Ready to upload to Chrome Web Store Developer Console!');
}

pack().catch(console.error);
