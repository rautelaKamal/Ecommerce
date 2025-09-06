import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const sessionData = await auth.api.getSession({
      headers: new Headers(),
      query: {}
    });

    if (!sessionData?.session) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    return NextResponse.json({ session: sessionData.session }, { status: 200 });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
