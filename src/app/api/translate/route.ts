import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { q, source = 'en', target = 'es' } = body || {};

    if (!q || typeof q !== 'string') {
      return NextResponse.json({ error: 'Missing q' }, { status: 400 });
    }

    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, source, target, format: 'text' }),
      // Avoid caching to reflect live translations
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Translation failed', detail: text }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error', detail: String(err?.message || err) }, { status: 500 });
  }
}


