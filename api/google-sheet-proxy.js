// api/google-sheet-proxy.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const GOOGLE_SCRIPT_WEB_APP_URL = process.env.GOOGLE_SCRIPT_WEB_APP_URL;

    if (!GOOGLE_SCRIPT_WEB_APP_URL) {
      return res.status(500).json({ error: 'Missing Google Script URL in env' });
    }

    const response = await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You can optionally pass a shared secret here too if needed
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Google Sheet Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
