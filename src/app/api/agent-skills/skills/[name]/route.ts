import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  if (!/^[a-z0-9-]+$/.test(name)) return new NextResponse('Not found', { status: 404 })
  try {
    const file = path.resolve(process.cwd(), 'src/app/api/agent-skills/skills', name, 'SKILL.md')
    const md = await fs.readFile(file, 'utf8')
    return new NextResponse(md, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
