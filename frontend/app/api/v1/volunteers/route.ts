import { NextResponse } from 'next/server';

const MOCK_VOLUNTEERS = [
  {
    volunteer_id: 'VOL_A1B2C3',
    name: 'Shreyas Hegde',
    first_name: 'Shreyas',
    last_name: 'Hegde',
    email: 'shreyas@example.com',
    bio: 'Great at organizing and has a truck.',
    ai_normalized_skills: ['leadership', 'logistics', 'heavy_transport'],
    total_events: 12,
    trust_score: 98.5,
    status: 'ACTIVE'
  },
  {
    volunteer_id: 'VOL_X9Y8Z7',
    name: 'Anika S.',
    first_name: 'Anika',
    last_name: 'S.',
    email: 'anika@example.com',
    bio: 'Photographer with a passion for gardening.',
    ai_normalized_skills: ['photography', 'gardening'],
    total_events: 8,
    trust_score: 95.0,
    status: 'ACTIVE'
  }
];

export async function GET() {
  return NextResponse.json({ volunteers: MOCK_VOLUNTEERS });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newVol = {
    ...body,
    volunteer_id: `VOL_${Math.random().toString(36).slice(2,8).toUpperCase()}`,
    total_events: 0,
    status: 'ACTIVE',
    ai_normalized_skills: ['general_volunteer']
  };
  MOCK_VOLUNTEERS.unshift(newVol);
  return NextResponse.json({ 
    status: 'success', 
    message: 'Volunteer registered successfully.', 
    volunteer_id: newVol.volunteer_id,
    extracted_skills: newVol.ai_normalized_skills
  }, { status: 201 });
}
