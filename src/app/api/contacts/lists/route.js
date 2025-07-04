import { connectToDatabase } from '@/DB/db'
import Contact from '@/Models/contactModels';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();

    // Get distinct list names and their contact counts
    const lists = await Contact.aggregate([
      {
        $group: {
          _id: '$listName',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          id: '$_id',
          name: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching contact lists:', error);
    return NextResponse.json(
      { message: 'Error fetching contact lists', error: error.message },
      { status: 500 }
    );
  }
}