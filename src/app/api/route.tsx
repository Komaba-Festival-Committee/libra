import conncectToDatabase from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { client, db } = await conncectToDatabase();
    const collection = db.collection('text_files');
    const files = await collection.find({}).toArray();
    return NextResponse.json(files, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
