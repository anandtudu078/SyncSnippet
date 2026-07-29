const crypto = require('crypto');
const http = require('http');

// Use the webhook secret from your .env.local (hardcoded here for testing)
const WEBHOOK_SECRET = 'b53be67424375e198291adaaa6330e87eb7d80a11d3e782079bbc25e85e81685'; // replace with your actual secret

const payload = {
  ref: 'refs/heads/main',
  repository: {
    full_name: 'anandtudu078/Tribe'   // <-- your test repo
  },
  installation: {
    id: 149771928   // <-- your current installation ID (from Supabase)
  },
  commits: [{}]
};

const body = JSON.stringify(payload);
const signature = 'sha256=' + crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/webhooks/github',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Hub-Signature-256': signature
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    console.log('\nCheck Supabase snippets table – the rendered_html should be updated.');
  });
});

req.on('error', (e) => console.error('Error:', e));
req.write(body);
req.end();


// const payload = {
//   ref: 'refs/heads/main',          // must match snippet.branch (if branch is "main")
//   repository: {
//     full_name: 'anandtudu078/Tribe' // must match snippet.repository_full_name exactly
//   },
//   installation: {
//     id: 149771928                   // your current installation ID
//   },
//   commits: [{}]
// };
