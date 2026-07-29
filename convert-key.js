const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const pemPath = process.argv[2] || './key.pem';
if (!fs.existsSync(pemPath)) {
  console.error('❌ PEM file not found. Usage: node convert-key.js your-key.pem');
  process.exit(1);
}

let privateKey = fs.readFileSync(pemPath, 'utf8');
// Remove any accidental outer quotes or whitespace
privateKey = privateKey.replace(/^"(.*)"$/, '$1').trim();

try {
  const keyObject = crypto.createPrivateKey(privateKey);
  const pkcs8 = keyObject.export({ type: 'pkcs8', format: 'pem' });
  console.log('✅ PKCS#8 key (copy everything between the lines):');
  console.log('---------------------------------------------');
  console.log(pkcs8);
  console.log('---------------------------------------------');
  console.log('\nNow replace GITHUB_PRIVATE_KEY in .env.local with this string, using \\n for every line break.');
} catch (err) {
  console.error('❌ Error converting key:', err.message);
  console.log('Make sure your key.pem contains a valid private key in PEM format.');
}
