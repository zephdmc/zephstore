export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    fullName,
    phone,
    email,
    skinType,
    skinConcerns,
    otherConcern,
    routineDescription,
    contactMethod,
    consent,
  } = req.body;

  const sheetScriptURL = 'https://script.google.com/macros/s/AKfycbx82NEYlK9u9dyz5k0KKvWM1jtJi8lKXxRm-ZQJtTeR2ROvALUZLyHkXuVsYx5rN77T5Q/exec';

  try {
    const response = await fetch(sheetScriptURL, {
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

    const contentType = response.headers.get('content-type');
    const status = response.status;
    const raw = await response.text();

    console.log('Google Script Raw Response:', raw);
    console.log('Status:', status);
    console.log('Content-Type:', contentType);

    if (contentType && contentType.includes('application/json')) {
      // If response is already JSON
      const result = JSON.parse(raw);
      return res.status(200).json({ success: true, result });
    } else {
      // Response is likely an error page or script exception
      return res.status(500).json({
        success: false,
        error: 'Google Script did not return valid JSON',
        status,
        contentType,
        raw,
      });
    }
  } catch (error) {
    console.error('Fetch Error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
