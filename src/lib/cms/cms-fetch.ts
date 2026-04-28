export function isCmsConfigured(): boolean {
  return !!process.env.SSP_CMS_URL && !!process.env.SSP_CMS_API_KEY
}

export async function cmsFetch<T>(path: string, revalidate = 60): Promise<T> {
  if (!isCmsConfigured()) {
    throw new Error('SSP CMS not configured (SSP_CMS_URL or SSP_CMS_API_KEY missing)')
  }
  const url = `${process.env.SSP_CMS_URL}${path}`
  const res = await fetch(url, {
    headers: { 'x-api-key': process.env.SSP_CMS_API_KEY ?? '' },
    next: { revalidate },
  } as RequestInit & { next: { revalidate: number } })
  if (!res.ok) {
    throw new Error(`CMS error: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}
