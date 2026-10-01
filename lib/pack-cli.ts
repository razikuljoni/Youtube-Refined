import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { 
  getAllExtensionFiles, 
  generateIconSvg,
  BASE64_ICON16,
  BASE64_ICON32,
  BASE64_ICON48,
  BASE64_ICON128,
  decodeBase64ToUint8Array
} from './extension-packager';

async function pack() {
  console.log('📦 Packaging YouTube Refined Chrome Extension (Manifest V3)...');
  
  const zip = new JSZip();
  const files = getAllExtensionFiles();

  files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  // Package true binary PNG icons for Chrome Extension Manifest V3 compliance
  zip.file('icons/icon16.png', decodeBase64ToUint8Array(BASE64_ICON16));
  zip.file('icons/icon32.png', decodeBase64ToUint8Array(BASE64_ICON32));
  zip.file('icons/icon48.png', decodeBase64ToUint8Array(BASE64_ICON48));
  zip.file('icons/icon128.png', decodeBase64ToUint8Array(BASE64_ICON128));
  zip.file('icons/icon.svg', generateIconSvg());

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
