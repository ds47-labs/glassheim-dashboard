import fs from 'fs';
import path from 'path';

const template = fs.readFileSync('./config.template.js', 'utf8');

const config = template
  .replace('{{ PUBLIC_HA_URL }}', process.env.PUBLIC_HA_URL || 'http://localhost:8123')
  .replace('{{ PUBLIC_HA_TOKEN }}', process.env.PUBLIC_HA_TOKEN || '');

const outputPath = path.join('./build/client', 'config.js');
fs.writeFileSync(outputPath, config);

console.log('✓ Generated config.js');
console.log(`  PUBLIC_HA_URL: ${process.env.PUBLIC_HA_URL || 'http://localhost:8123'}`);
