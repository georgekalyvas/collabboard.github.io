#!/usr/bin/env node

/**
 * Build script for CollabBoard
 * Injects environment variables into HTML and copies static assets to dist/
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment variables (use Vercel env vars or fallback to empty strings)
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

console.log('🔨 Building CollabBoard...\n');

// Create dist directory
const distDir = join(__dirname, 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
  console.log('✅ Created dist/ directory');
}

// Read index.html
const indexPath = join(__dirname, 'index.html');
let html = readFileSync(indexPath, 'utf-8');

// Inject environment variables
console.log('\n🔧 Injecting environment variables:');
console.log(`   SUPABASE_URL: ${SUPABASE_URL ? '✅ Set (' + SUPABASE_URL.substring(0, 30) + '...)' : '⚠️  Not set (fallback mode)'}`);
console.log(`   SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✅ Set (' + SUPABASE_ANON_KEY.substring(0, 20) + '...)' : '⚠️  Not set (fallback mode)'}`);

// Replace the environment variable script section
const envVarScript = `<script>
            // Set these to your project values (or inject via hosting env)
            window.SUPABASE_URL = window.SUPABASE_URL || '';
            window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';
        </script>`;

const injectedScript = `<script>
            // Environment variables injected at build time
            window.SUPABASE_URL = '${SUPABASE_URL}';
            window.SUPABASE_ANON_KEY = '${SUPABASE_ANON_KEY}';
        </script>`;

html = html.replace(envVarScript, injectedScript);

// Write the modified HTML to dist/
writeFileSync(join(distDir, 'index.html'), html);
console.log('\n✅ Built index.html with environment variables');

// Copy static assets
const assets = [
  'app.js',
  'style.css',
  'qrcode.min.js',
  'favicon.svg',
  'site.webmanifest',
  'generate-favicon.html'
];

console.log('\n📦 Copying static assets:');
assets.forEach(asset => {
  const assetPath = join(__dirname, asset);
  if (existsSync(assetPath)) {
    cpSync(assetPath, join(distDir, asset));
    console.log(`   ✅ ${asset}`);
  } else {
    console.log(`   ⚠️  ${asset} (not found, skipping)`);
  }
});

// Copy favicon images if they exist
const faviconFiles = [
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png'
];

faviconFiles.forEach(favicon => {
  const faviconPath = join(__dirname, favicon);
  if (existsSync(faviconPath)) {
    cpSync(faviconPath, join(distDir, favicon));
    console.log(`   ✅ ${favicon}`);
  }
});

// Copy tools directory if it exists
const toolsDir = join(__dirname, 'tools');
if (existsSync(toolsDir)) {
  cpSync(toolsDir, join(distDir, 'tools'), { recursive: true });
  console.log('   ✅ tools/');
}

console.log('\n✨ Build complete! Output in dist/');
console.log('\n📝 Next steps:');
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('   ⚠️  No Supabase credentials detected - app will run in fallback mode');
  console.log('   💡 To enable backend features:');
  console.log('      1. Create a Supabase project at https://supabase.com');
  console.log('      2. Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel environment variables');
  console.log('      3. Run the SQL from tools/supabase_schema.sql in your Supabase project');
} else {
  console.log('   ✅ Supabase credentials configured - backend features enabled!');
}
console.log('\n   🚀 Deploy: vercel --prod');
console.log('   🔍 Test locally: npm run serve\n');
