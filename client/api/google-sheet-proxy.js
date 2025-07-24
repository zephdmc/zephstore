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

  const sheetScriptURL = 'https://script.google.com/macros/s/AKfycbyuQMNBHVlXDmh7x6g29ynqb8Em8CHLaCZYjmOLiWINUFLyFj3JCbLc3AVluWpL8gx5OA/exec';

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

    const raw = await response.text(); // Always read as text first
    console.log('Google Script Raw Response:', raw);

    try {
      const result = JSON.parse(raw); // Try parsing as JSON
      return res.status(200).json({ success: true, result });
    } catch (jsonError) {
      console.error('Invalid JSON from Google Script:', jsonError.message);
      return res.status(500).json({ success: false, error: 'Google Script did not return valid JSON', raw });
    }
  } catch (error) {
    console.error('Fetch Error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
