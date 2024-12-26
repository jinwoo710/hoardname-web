import { drizzle } from 'drizzle-orm/d1';
import { example } from '@/db/schema';

export const runtime = 'edge';

export async function GET(request: Request, { env }: { env: any }) {
  const db = drizzle(env.DB);
  
  try {
    // 데이터 조회 예시
    const results = await db.select().from(example);
    return Response.json({ data: results });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request, { env }: { env: any }) {
  const db = drizzle(env.DB);
  const data = await request.json();
  
  try {
    // 데이터 삽입 예시
    const result = await db.insert(example).values({
      name: data.name,
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to insert data' }, { status: 500 });
  }
}
