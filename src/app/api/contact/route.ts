import { NextRequest, NextResponse } from 'next/server'

interface ContactBody {
  name?: string
  email?: string
  subject?: string
  message?: string
  [key: string]: unknown
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as ContactBody

    const forwardedFor = req.headers.get('x-forwarded-for') ?? 'unknown'

    const relayResponse = await fetch('https://relay.ssp.runonflux.io/v1/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-challenge': 'ssp',
        'x-forwarded-for': forwardedFor,
      },
      body: JSON.stringify(body),
    })

    const result: unknown = await relayResponse.json()
    return NextResponse.json(result, { status: relayResponse.status })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error submitting contact form:', error)
    }
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }
}

function methodNotAllowed(): NextResponse {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
export const HEAD = methodNotAllowed
export const OPTIONS = methodNotAllowed
