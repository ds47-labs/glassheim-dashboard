import fs from 'fs';
import path from 'path';

const outputPath = path.join('./build/client', 'config.js');

// Check if config.js already exists (e.g., mounted from Kubernetes ConfigMap)
if (fs.existsSync(outputPath)) {
  console.log('✓ Using existing config.js (mounted from ConfigMap)');
  process.exit(0);
}

try {
  const template = fs.readFileSync('./config.template.js', 'utf8');

  const config = template
    .replace('{{ PUBLIC_HA_URL }}', process.env.PUBLIC_HA_URL || 'http://localhost:8123')
    .replace('{{ PUBLIC_HA_TOKEN }}', process.env.PUBLIC_HA_TOKEN || '');

  fs.writeFileSync(outputPath, config);

  console.log('✓ Generated config.js');
  console.log(`  PUBLIC_HA_URL: ${process.env.PUBLIC_HA_URL || 'http://localhost:8123'}`);
} catch (err) {
  // If write fails (e.g., read-only filesystem) but config isn't mounted, warn but continue
  // The app will use PUBLIC_ env vars as fallback
  if (err.code === 'ENOENT' || err.code === 'EACCES') {
    console.warn('⚠ Could not generate config.js:', err.message);
    console.warn('  App will use PUBLIC_HA_URL and PUBLIC_HA_TOKEN env vars');
    process.exit(0);
  }
  throw err;
}
