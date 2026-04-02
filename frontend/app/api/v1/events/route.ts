import { NextResponse } from 'next/server';

const MOCK_EVENTS = [
  {
    event_id: 'EVT_20260402_A1B2C3',
    name: 'Community Food Drive',
    description: 'Collecting and distributing food for local families.',
    date: '2026-04-15',
    time: '09:00:00Z',
    location: 'Community Center',
    slots_total: 50,
    slots_filled: 12,
    skills_needed: ['leadership', 'lifting', 'transportation'],
    status: 'OPEN',
    created_at: new Date().toISOString()
  },
  {
    event_id: 'EVT_20260402_X9Y8Z7',
    name: 'Riverside Park Cleanup',
    description: 'Restoring the park after the winter season.',
    date: '2026-04-20',
    time: '10:00:00Z',
    location: 'Downtown Riverside',
    slots_total: 20,
    slots_filled: 20,
    skills_needed: ['gardening', 'physical_labor'],
    status: 'FILLED',
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json({ events: MOCK_EVENTS });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newEvent = {
    ...body,
    event_id: `EVT_${new Date().toISOString().slice(0,10).replace(/-/g,'')}_${Math.random().toString(36).slice(2,8).toUpperCase()}`,
    slots_filled: 0,
    status: 'OPEN',
    created_at: new Date().toISOString()
  };
  MOCK_EVENTS.unshift(newEvent);
  return NextResponse.json({ status: 'success', event_id: newEvent.event_id }, { status: 201 });
}
