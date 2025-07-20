/* eslint-disable no-console */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const relayResponse = await fetch('https://relay.sspwallet.io/v1/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-challenge': 'ssp',
        'x-forwarded-for':
          req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown',
      },
      body: JSON.stringify(req.body),
    })

    const result = await relayResponse.json()
    return res.status(relayResponse.status).json(result)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error submitting support ticket:', error)
    }
    return res.status(500).json({ error: 'Failed to submit support ticket' })
  }
}
