export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { fullName, phone, email, skinType, skinConcerns, otherConcern, routineDescription, contactMethod, consent } = req.body;

  const sheetScriptURL = 'https://script.google.com/macros/s/AKfycbw692QxPLyirY9i1vOgyU7NitKJMOfbr1dMvzhFqszFmqZyHd_ywRMiYtvA3l-StpvF/exec'; // 🔁 Replace this with your actual deployed script URL

  try {
    const googleRes = await fetch(sheetScriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        phone,
        email,
        skinType,
        skinConcerns: Array.isArray(skinConcerns) ? skinConcerns.join(', ') : '',
        otherConcern,
        routineDescription,
        contactMethod,
        consent,
      }),
    });

    const data = await googleRes.json();

    if (googleRes.ok) {
      res.status(200).json({ success: true, data });
    } else {
      res.status(500).json({ success: false, error: data.error || 'Google Sheet error' });
    }
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

